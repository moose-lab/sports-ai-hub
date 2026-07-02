/**
 * ESPN → World Cup snapshot transform.
 *
 * A faithful TypeScript port of the pure transform in awesome-sports-ai's
 * `scripts/sync-fifa-world-cup.mjs`. The upstream cron runs this every ~5 min
 * and commits the result; we run the IDENTICAL logic inside the Cloudflare
 * Pages Function (`functions/api/worldcup.ts`) at request time so the site can
 * overlay ESPN's ~6-second-fresh live scores onto the slow GitHub skeleton —
 * bypassing both the 5-min cron and the 5-min raw.githubusercontent CDN.
 *
 * Keep this in sync with the upstream script. The shared cases are locked by
 * `espn.test.ts` (mirrored from the upstream test).
 *
 * Environment-agnostic: no DOM, no Node fs — only `Date`, `Intl`, and plain
 * objects, so it runs unchanged in the browser bundle, Node (tests), and the
 * Workers runtime.
 */

const easternTimeZone = "America/New_York";

/** One fixture in the feed's `confirmedFixtures` shape (consumed by parseWorldCup). */
export interface EspnFixture {
  date: string;
  match: string;
  round: string;
  group?: string;
  venue: string;
  tag: string;
  status: string;
  score: string;
  insight: string;
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const formatJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

const addUtcDays = (date: Date, days: number): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + days));

const formatApiDate = (date: Date): string =>
  `${date.getUTCFullYear()}${String(date.getUTCMonth() + 1).padStart(2, "0")}${String(date.getUTCDate()).padStart(2, "0")}`;

const formatGeneratedDate = (date: Date): string =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

/** Tournament window with a small margin around the Jun 11 opener and Jul 19 final. */
export const isWithinTournamentWindow = (now: Date = new Date()): boolean => {
  const t = now.getTime();
  const start = Date.UTC(2026, 5, 10, 0, 0, 0); // Jun 10, 2026 UTC
  const end = Date.UTC(2026, 6, 20, 23, 59, 59); // Jul 20, 2026 UTC
  return t >= start && t <= end;
};

const formatLongDate = (date: Date): string =>
  new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" }).format(date);

const formatFixtureDate = (date: Date): string =>
  new Intl.DateTimeFormat("en-US", { timeZone: easternTimeZone, month: "short", day: "numeric" }).format(date);

const formatEasternKickoff = (date: Date): string => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: easternTimeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  ) as Record<string, string>;
  const dayPeriod = parts.dayPeriod.toLowerCase() === "am" ? "a.m." : "p.m.";
  const minute = parts.minute === "00" ? "" : `:${parts.minute}`;
  return `${parts.hour}${minute} ${dayPeriod} ET`;
};

const stripDiacritics = (value: string): string => value.normalize("NFD").replace(/[̀-ͯ]/g, "");

const normalizeTeamName = (value: string): string => {
  const ascii = stripDiacritics(value);
  const replacements: Record<string, string> = {
    "Cape Verde": "Cabo Verde",
    "Ivory Coast": "Cote d'Ivoire",
  };
  return replacements[ascii] ?? ascii;
};

const venueCity = (competition: any): string => {
  const city = competition.venue?.address?.city ?? "";
  return city.split(",")[0] || competition.venue?.fullName || "TBD";
};

const openingPhaseRound = "Opening phase";

const isLegacyGroupLabel = (value: unknown): boolean =>
  /^Group (?:[A-L]|stage)$/i.test(String(value ?? "").trim());

const normalizeRoundLabel = (value: unknown): string => {
  const label = String(value ?? "").replace(/-/g, " ").replace(/\s+/g, " ").trim();
  const lower = label.toLowerCase();

  if (!label || isLegacyGroupLabel(label)) return openingPhaseRound;
  if (lower === "round of 32") return "Round of 32";
  if (lower === "round of 16") return "Round of 16";
  if (lower === "quarterfinal" || lower === "quarterfinals") return "Quarterfinals";
  if (lower === "semifinal" || lower === "semifinals") return "Semifinals";
  if (lower === "third place match") return "Third-place match";
  if (lower === "final") return "Final";

  return label;
};

const roundFromNote = (competition: any): string => {
  const note = competition.altGameNote ?? "";
  const match = note.match(/Round of 32|Round of 16|Quarterfinals?|Semi-?finals?|Third-?place match|Final/i);
  return normalizeRoundLabel(match?.[0]);
};

const statusFromCompetition = (competition: any): string => {
  const type = competition.status?.type ?? {};
  if (type.completed || type.state === "post") return "Final";
  if (type.state === "in") return "Live";
  return "Scheduled";
};

const scoreForFixture = (status: string, home: any, away: any, eventDate: Date): string => {
  if (status === "Scheduled") return formatEasternKickoff(eventDate);
  return `${home.team.abbreviation} ${home.score ?? "0"} - ${away.team.abbreviation} ${away.score ?? "0"}`;
};

const normalizeFixtureMatch = (match: string): string => match.split(" v ").map(normalizeTeamName).join(" v ");

const fixtureKey = (fixture: { match: string }): string => normalizeFixtureMatch(fixture.match);

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const sortableDate = (fixture: any): string => {
  if (fixture.sortKey) return fixture.sortKey;
  const match = String(fixture.date).match(/^([A-Z][a-z]{2}) (\d{1,2})$/);
  if (!match) return "9999-12-31T00:00:00.000Z";
  return new Date(Date.UTC(2026, MONTH_INDEX[match[1]], Number(match[2]))).toISOString();
};

const publicFixture = (fixture: any): EspnFixture => {
  const { sortKey, ...rest } = fixture;
  return rest;
};

const plural = (count: number, singular: string, pluralForm = `${singular}s`): string =>
  count === 1 ? `one ${singular}` : `${count} ${pluralForm}`;

const beVerb = (count: number): string => (count === 1 ? "is" : "are");

const liveScoreValue = (fixture: EspnFixture | undefined): string => {
  if (!fixture) return "None";
  const match = fixture.score.match(/^([A-Z]{2,4}) (\d+) - [A-Z]{2,4} (\d+)$/);
  if (!match) return fixture.score;
  return `${match[1]} ${match[2]}-${match[3]}`;
};

const liveSummary = (fixture: EspnFixture | undefined): string => {
  if (!fixture) return "no match is live";
  const [home, away] = fixture.match.split(" v ");
  const score = fixture.score.match(/^[A-Z]{2,4} (\d+) - [A-Z]{2,4} (\d+)$/);
  if (!score) return `${fixture.match} is live`;
  const homeScore = Number(score[1]);
  const awayScore = Number(score[2]);
  if (homeScore === awayScore) return `${home} and ${away} are tied ${homeScore}-${awayScore} live`;
  if (homeScore > awayScore) return `${home} leads ${away} ${homeScore}-${awayScore} live`;
  return `${away} leads ${home} ${awayScore}-${homeScore} live`;
};

export const buildDateWindow = (now: Date = new Date()): string[] => [
  formatApiDate(addUtcDays(now, -2)),
  formatApiDate(addUtcDays(now, -1)),
  formatApiDate(addUtcDays(now, 0)),
  formatApiDate(addUtcDays(now, 1)),
];

export const normalizeScoreboardEvents = (scoreboards: any[]): EspnFixture[] =>
  scoreboards
    .flatMap((scoreboard) => scoreboard.events ?? [])
    .map((event: any) => {
      const competition = event.competitions?.[0];
      if (!competition) return null;
      const home = competition.competitors?.find((c: any) => c.homeAway === "home");
      const away = competition.competitors?.find((c: any) => c.homeAway === "away");
      if (!home || !away) return null;

      const eventDate = new Date(event.date);
      const status = statusFromCompetition(competition);
      const round = roundFromNote(competition);

      return {
        date: formatFixtureDate(eventDate),
        match: `${normalizeTeamName(home.team.displayName)} v ${normalizeTeamName(away.team.displayName)}`,
        round,
        venue: competition.venue?.fullName ?? "TBD",
        tag: round,
        status,
        score: scoreForFixture(status, home, away, eventDate),
        insight: status === "Scheduled" ? venueCity(competition) : status === "Live" ? "Live window" : "Full time",
        sortKey: eventDate.toISOString(),
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => a.sortKey.localeCompare(b.sortKey))
    .map(publicFixture);

const normalizeFixtureInsight = (insight: unknown): unknown =>
  /^Group [A-L] early edge$/i.test(String(insight ?? "")) ? "Opening phase result" : insight;

const fixtureTag = (tag: unknown, round: string): string => {
  if (!tag || isLegacyGroupLabel(tag)) return round;
  return String(tag);
};

const normalizeFixtureShape = (fixture: any): EspnFixture => {
  const { group, round: fixtureRound, date, match, venue, tag, status, score, insight, ...rest } = fixture;
  const round = normalizeRoundLabel(fixtureRound ?? group);

  return {
    date,
    match,
    round,
    venue,
    tag: fixtureTag(tag, round),
    status,
    score,
    insight: normalizeFixtureInsight(insight),
    ...rest,
  };
};

const mergeFixtures = (existingFixtures: any[], incomingFixtures: EspnFixture[]): EspnFixture[] => {
  const fixturesByKey = new Map<string, any>();

  existingFixtures.forEach((fixture, index) => {
    const normalizedFixture = normalizeFixtureShape(fixture);
    fixturesByKey.set(fixtureKey(normalizedFixture), {
      ...normalizedFixture,
      sortKey: sortableDate(fixture),
      originalIndex: index,
    });
  });

  incomingFixtures.forEach((fixture) => {
    const normalizedFixture = normalizeFixtureShape(fixture);
    const existing = fixturesByKey.get(fixtureKey(normalizedFixture));
    fixturesByKey.set(fixtureKey(normalizedFixture), {
      ...existing,
      ...normalizedFixture,
      tag:
        existing?.tag && existing.tag !== existing.round && !isLegacyGroupLabel(existing.tag)
          ? existing.tag
          : normalizedFixture.tag,
      sortKey: sortableDate(normalizedFixture),
      originalIndex: existing?.originalIndex ?? existingFixtures.length,
    });
  });

  return Array.from(fixturesByKey.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.originalIndex - b.originalIndex)
    .map(({ originalIndex, ...fixture }) => publicFixture(fixture));
};

const usesKnockoutStats = (stats: unknown): boolean =>
  Array.isArray(stats) && stats.some((stat: any) => stat.label === "Knockout field");

const buildStats = (existingStats: unknown, fixtures: EspnFixture[]) => {
  if (usesKnockoutStats(existingStats)) return existingStats;

  const finalCount = fixtures.filter((f) => f.status === "Final").length;
  const liveFixture = fixtures.find((f) => f.status === "Live");
  const scheduledCount = fixtures.filter((f) => f.status === "Scheduled").length;
  return [
    { label: "Final results", value: String(finalCount) },
    { label: "Live match", value: liveScoreValue(liveFixture) },
    { label: "Scheduled next", value: String(scheduledCount) },
    { label: "Tournament field", value: "48 teams" },
  ];
};

const buildFixtureSummary = (existingSummary: any, fixtures: EspnFixture[]) => {
  const finalCount = fixtures.filter((f) => f.status === "Final").length;
  const liveFixture = fixtures.find((f) => f.status === "Live");
  const scheduledCount = fixtures.filter((f) => f.status === "Scheduled").length;
  const firstDate = fixtures[0]?.date ?? "";
  const lastDate = fixtures.at(-1)?.date ?? firstDate;
  const finalPhrase = `${finalCount === 1 ? "One match is" : `${finalCount} matches are`} final`;
  const scheduledPhrase =
    scheduledCount === 0
      ? "no fixtures are scheduled next"
      : `${plural(scheduledCount, "fixture")} ${beVerb(scheduledCount)} scheduled next`;
  return {
    ...existingSummary,
    label: existingSummary?.label ?? "Knockout-stage tool contract",
    window:
      existingSummary?.label === "Knockout-stage tool contract" && existingSummary?.window
        ? existingSummary.window
        : firstDate === lastDate
          ? firstDate
          : `${firstDate}-${lastDate.replace(/^[A-Z][a-z]{2} /, "")}`,
    detail: `${finalPhrase}, ${liveSummary(liveFixture)}, and ${scheduledPhrase}.`,
  };
};

const streamStatus = (fixtures: EspnFixture[]): string => {
  if (fixtures.some((f) => f.status === "Live")) return "Live coverage active";
  if (fixtures.some((f) => f.status === "Scheduled")) return "Pre-match coverage queued";
  return "Post-match snapshot";
};

const buildUpdateStream = (existingStream: any, fixtures: EspnFixture[], fixtureSummary: any, now: Date) => {
  if (!existingStream) return undefined;
  return {
    ...existingStream,
    currentWindow:
      existingStream.label === "Knockout update stream" && existingStream.currentWindow
        ? existingStream.currentWindow
        : fixtureSummary.window,
    lastVerifiedAt: formatGeneratedDate(now),
    status: streamStatus(fixtures),
  };
};

/**
 * Merge ESPN scoreboards into a source-data snapshot, returning the updated
 * snapshot (and whether anything changed). Mirrors the upstream cron exactly.
 */
export const syncSourceData = (
  sourceData: any,
  scoreboards: any[],
  options: { now?: Date } = {},
): { data: any; changed: boolean } => {
  const now = options.now ?? new Date();
  const data = clone(sourceData);
  const incomingFixtures = normalizeScoreboardEvents(scoreboards);
  const fifaWorldCup = data.fifaWorldCup ?? {};
  const fixtures = mergeFixtures(fifaWorldCup.confirmedFixtures ?? [], incomingFixtures);
  const fixtureSummary = buildFixtureSummary(fifaWorldCup.fixtureSummary, fixtures);
  const updateStream = buildUpdateStream(fifaWorldCup.updateStream, fixtures, fixtureSummary, now);

  data.generatedDate = formatGeneratedDate(now);
  data.fifaWorldCup = {
    ...fifaWorldCup,
    updated: `Updated ${formatLongDate(now)}`,
    stats: buildStats(fifaWorldCup.stats, fixtures),
    fixtureSummary,
    ...(updateStream ? { updateStream } : {}),
    confirmedFixtures: fixtures,
  };

  return { data, changed: formatJson(data) !== formatJson(sourceData) };
};
