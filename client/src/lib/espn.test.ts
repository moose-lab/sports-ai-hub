import { describe, expect, it } from "vitest";
import { buildDateWindow, isWithinTournamentWindow, normalizeScoreboardEvents, syncSourceData } from "@/lib/espn";

/**
 * Mirrors awesome-sports-ai's `sync-fifa-world-cup.test.mjs` to keep the ported
 * transform in lockstep with the upstream cron, plus an explicit overlay case
 * (ESPN status/score override the GitHub skeleton fixture).
 */

const event = (o: any) => ({
  id: o.id,
  date: o.date,
  competitions: [
    {
      altGameNote: `FIFA World Cup, ${o.group}`,
      venue: { fullName: o.venue, address: { city: o.city } },
      status: { type: { state: o.state, completed: o.completed ?? false, shortDetail: o.shortDetail } },
      competitors: [
        { homeAway: "home", score: o.homeScore ?? "0", team: { abbreviation: o.homeAbbr, displayName: o.homeName } },
        { homeAway: "away", score: o.awayScore ?? "0", team: { abbreviation: o.awayAbbr, displayName: o.awayName } },
      ],
    },
  ],
});

const scoreboard = {
  events: [
    event({ id: "760422", date: "2026-06-14T17:00:00Z", homeName: "Germany", homeAbbr: "GER", homeScore: "7", awayName: "Curaçao", awayAbbr: "CUW", awayScore: "1", state: "post", completed: true, shortDetail: "FT", venue: "NRG Stadium", city: "Houston, Texas", group: "Group E" }),
    event({ id: "760424", date: "2026-06-15T02:00:00Z", homeName: "Sweden", homeAbbr: "SWE", homeScore: "2", awayName: "Tunisia", awayAbbr: "TUN", awayScore: "0", state: "in", shortDetail: "37'", venue: "Estadio BBVA", city: "Guadalupe", group: "Group F" }),
    event({ id: "760428", date: "2026-06-15T16:00:00Z", homeName: "Spain", homeAbbr: "ESP", awayName: "Cape Verde", awayAbbr: "CPV", state: "pre", shortDetail: "Scheduled", venue: "Mercedes-Benz Stadium", city: "Atlanta, Georgia", group: "Group H" }),
  ],
};

const sourceData = {
  generatedDate: "2026-06-14",
  nbaFinals: { title: "NBA Finals 2026: Knicks Champions", updated: "Updated June 14, 2026" },
  fifaWorldCup: {
    title: "FIFA World Cup 2026",
    subtitle: "Canada, Mexico, United States",
    updated: "Updated June 14, 2026",
    links: [],
    stats: [],
    fixtureSummary: { label: "Group-stage live snapshot", window: "Jun 14", detail: "Old detail" },
    updateStream: { label: "Live update stream", cadence: "Every 3 hours during match windows", currentWindow: "Jun 14", source: "ESPN FIFA World Cup scoreboard API", lastVerifiedAt: "2026-06-14", status: "Pending refresh", consumers: ["Sports AI Hub"] },
    confirmedFixtures: [
      { date: "Jun 14", match: "Germany v Curacao", group: "Group E", venue: "Houston Stadium", tag: "Group E", status: "Scheduled", score: "1 p.m. ET", insight: "Houston" },
      { date: "Jun 15", match: "Spain v Cabo Verde", group: "Group H", venue: "Mercedes-Benz Stadium", tag: "Group H", status: "Scheduled", score: "12 p.m. ET", insight: "Atlanta" },
    ],
    milestones: [],
  },
};

describe("buildDateWindow", () => {
  it("covers the stale-live catch-up window in UTC", () => {
    expect(buildDateWindow(new Date("2026-06-15T05:00:00Z"))).toEqual(["20260613", "20260614", "20260615", "20260616"]);
  });
});

describe("normalizeScoreboardEvents", () => {
  it("normalizes ESPN events into FIFA fixtures", () => {
    const fixtures = normalizeScoreboardEvents([scoreboard]);
    expect(fixtures.map((f) => f.match)).toEqual(["Germany v Curacao", "Sweden v Tunisia", "Spain v Cabo Verde"]);
    expect(fixtures.map((f) => f.status)).toEqual(["Final", "Live", "Scheduled"]);
    expect(fixtures.map((f: any) => f.round)).toEqual(["Opening phase", "Opening phase", "Opening phase"]);
    expect(fixtures.every((f: any) => !("group" in f))).toBe(true);
    expect(fixtures[0].score).toBe("GER 7 - CUW 1");
    expect(fixtures[1].date).toBe("Jun 14");
    expect(fixtures[1].score).toBe("SWE 2 - TUN 0");
    expect(fixtures[2].score).toBe("12 p.m. ET");
    expect(fixtures[2].venue).toBe("Mercedes-Benz Stadium");
  });
});

describe("syncSourceData", () => {
  it("updates only the FIFA snapshot and preserves NBA data", () => {
    const { data, changed } = syncSourceData(sourceData, [scoreboard], { now: new Date("2026-06-15T05:00:00Z") });
    expect(changed).toBe(true);
    expect(data.generatedDate).toBe("2026-06-15");
    expect(data.nbaFinals).toEqual(sourceData.nbaFinals);
    expect(data.fifaWorldCup.updated).toBe("Updated June 15, 2026");
    expect(data.fifaWorldCup.stats).toEqual([
      { label: "Final results", value: "1" },
      { label: "Live match", value: "SWE 2-0" },
      { label: "Scheduled next", value: "1" },
      { label: "Tournament field", value: "48 teams" },
    ]);
    expect(data.fifaWorldCup.fixtureSummary.detail).toMatch(/One match is final/);
    expect(data.fifaWorldCup.fixtureSummary.detail).toMatch(/Sweden leads Tunisia 2-0 live/);
    expect(data.fifaWorldCup.updateStream.status).toBe("Live coverage active");
  });

  it("overlays ESPN status/score onto the skeleton fixture (the core fix)", () => {
    const { data } = syncSourceData(sourceData, [scoreboard], { now: new Date("2026-06-15T05:00:00Z") });
    const germany = data.fifaWorldCup.confirmedFixtures.find((f: any) => f.match === "Germany v Curacao");
    // Skeleton had it "Scheduled / 1 p.m. ET"; ESPN says it finished 7-1.
    expect(germany.status).toBe("Final");
    expect(germany.score).toBe("GER 7 - CUW 1");
    expect(germany.round).toBe("Opening phase");
    expect("group" in germany).toBe(false);
    // A live match ESPN reports but the skeleton lacks gets added.
    expect(data.fifaWorldCup.confirmedFixtures.some((f: any) => f.match === "Sweden v Tunisia")).toBe(true);
  });

  it("preserves knockout metadata while overlaying round-first fixtures", () => {
    const knockoutStats = [
      { label: "Knockout field", value: "32 teams" },
      { label: "Format", value: "Single elimination" },
      { label: "Next stage", value: "Round of 32" },
      { label: "Tournament field", value: "48 teams" },
    ];
    const knockoutSource = {
      ...sourceData,
      fifaWorldCup: {
        ...sourceData.fifaWorldCup,
        stats: knockoutStats,
        fixtureSummary: {
          label: "Knockout-stage tool contract",
          window: "Round of 32",
          detail: "Old detail",
        },
        updateStream: {
          ...sourceData.fifaWorldCup.updateStream,
          label: "Knockout update stream",
          currentWindow: "Round of 32",
        },
        confirmedFixtures: [
          {
            date: "Jun 29",
            match: "Brazil v Japan",
            round: "Round of 32",
            venue: "New York New Jersey Stadium",
            tag: "Round of 32",
            status: "Scheduled",
            score: "12 p.m. ET",
            insight: "East Rutherford",
          },
        ],
      },
    };
    const knockoutScoreboard = {
      events: [
        event({
          id: "760501",
          date: "2026-06-29T16:00:00Z",
          homeName: "Brazil",
          homeAbbr: "BRA",
          homeScore: "2",
          awayName: "Japan",
          awayAbbr: "JPN",
          awayScore: "1",
          state: "post",
          completed: true,
          shortDetail: "FT",
          venue: "New York New Jersey Stadium",
          city: "East Rutherford",
          group: "Round of 32",
        }),
      ],
    };

    const { data } = syncSourceData(knockoutSource, [knockoutScoreboard], { now: new Date("2026-06-30T05:00:00Z") });
    const brazil = data.fifaWorldCup.confirmedFixtures.find((f: any) => f.match === "Brazil v Japan");

    expect(data.fifaWorldCup.stats).toEqual(knockoutStats);
    expect(data.fifaWorldCup.fixtureSummary.window).toBe("Round of 32");
    expect(data.fifaWorldCup.updateStream.currentWindow).toBe("Round of 32");
    expect(brazil.round).toBe("Round of 32");
    expect(brazil.tag).toBe("Round of 32");
    expect("group" in brazil).toBe(false);
  });

  it("describes away-leading and tied live matches", () => {
    const away = syncSourceData(
      { ...sourceData, fifaWorldCup: { ...sourceData.fifaWorldCup, confirmedFixtures: [] } },
      [{ events: [event({ id: "1", date: "2026-06-25T22:00:00Z", homeName: "Czechia", homeAbbr: "CZE", homeScore: "0", awayName: "Mexico", awayAbbr: "MEX", awayScore: "3", state: "in", group: "Group A", venue: "x", city: "y" })] }],
      { now: new Date("2026-06-25T23:00:00Z") },
    );
    expect(away.data.fifaWorldCup.fixtureSummary.detail).toMatch(/Mexico leads Czechia 3-0 live/);

    const tied = syncSourceData(
      { ...sourceData, fifaWorldCup: { ...sourceData.fifaWorldCup, confirmedFixtures: [] } },
      [{ events: [event({ id: "2", date: "2026-06-25T20:00:00Z", homeName: "Morocco", homeAbbr: "MAR", homeScore: "1", awayName: "Haiti", awayAbbr: "HAI", awayScore: "1", state: "in", group: "Group C", venue: "x", city: "y" })] }],
      { now: new Date("2026-06-25T21:00:00Z") },
    );
    expect(tied.data.fifaWorldCup.fixtureSummary.detail).toMatch(/Morocco and Haiti are tied 1-1 live/);
  });

  it("is idempotent for the same payload", () => {
    const first = syncSourceData(sourceData, [scoreboard], { now: new Date("2026-06-15T05:00:00Z") });
    const second = syncSourceData(first.data, [scoreboard], { now: new Date("2026-06-15T05:00:00Z") });
    expect(second.changed).toBe(false);
    expect(second.data).toEqual(first.data);
  });

  it("leaves the skeleton fixtures intact when ESPN returns nothing", () => {
    const { data } = syncSourceData(sourceData, [{ events: [] }], { now: new Date("2026-06-15T05:00:00Z") });
    expect(data.fifaWorldCup.confirmedFixtures.map((f: any) => f.match)).toEqual(["Germany v Curacao", "Spain v Cabo Verde"]);
    expect(data.fifaWorldCup.confirmedFixtures[0].status).toBe("Scheduled"); // unchanged
  });
});

describe("isWithinTournamentWindow", () => {
  it("is true during and false outside the tournament", () => {
    expect(isWithinTournamentWindow(new Date("2026-06-25T12:00:00Z"))).toBe(true);
    expect(isWithinTournamentWindow(new Date("2026-07-19T20:00:00Z"))).toBe(true);
    expect(isWithinTournamentWindow(new Date("2026-05-01T12:00:00Z"))).toBe(false);
    expect(isWithinTournamentWindow(new Date("2026-08-01T12:00:00Z"))).toBe(false);
  });
});
