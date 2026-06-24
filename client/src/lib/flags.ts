/**
 * Country flags for World Cup teams.
 * The feed gives FIFA/IOC trigrams (BRA, ARG…) and full names but no flags,
 * so we map to ISO 3166-1 alpha-2 codes and serve SVGs from flagcdn.com
 * (UK home nations use the `gb-xxx` subdivision codes). Resolution tries the
 * trigram first, then the normalized team name; unmapped teams fall back to
 * the derived color block at the call site.
 */

/** FIFA/IOC three-letter code → ISO 3166-1 alpha-2 (flagcdn slug). */
const CODE_TO_ISO2: Record<string, string> = {
  AFG: "af", ALG: "dz", ANG: "ao", ARG: "ar", AUS: "au", AUT: "at",
  BEL: "be", BIH: "ba", BOL: "bo", BRA: "br", BUL: "bg", BFA: "bf",
  CMR: "cm", CAN: "ca", CPV: "cv", CHI: "cl", CHN: "cn", COL: "co",
  COD: "cd", CGO: "cg", CRC: "cr", CIV: "ci", CRO: "hr", CUW: "cw",
  CZE: "cz", DEN: "dk", ECU: "ec", EGY: "eg", ENG: "gb-eng", EQG: "gq",
  ESP: "es", FIN: "fi", FRA: "fr", GAB: "ga", GEO: "ge", GER: "de",
  GHA: "gh", GRE: "gr", GUI: "gn", HAI: "ht", HON: "hn", HUN: "hu",
  ISL: "is", IND: "in", IDN: "id", IRN: "ir", IRQ: "iq", IRL: "ie",
  ISR: "il", ITA: "it", JAM: "jm", JPN: "jp", JOR: "jo", KAZ: "kz",
  KEN: "ke", KOR: "kr", PRK: "kp", KSA: "sa", KUW: "kw", MAD: "mg",
  MAS: "my", MLI: "ml", MEX: "mx", MAR: "ma", NED: "nl", NZL: "nz",
  NGA: "ng", NIR: "gb-nir", NOR: "no", OMA: "om", PAN: "pa", PAR: "py",
  PER: "pe", POL: "pl", POR: "pt", QAT: "qa", ROU: "ro", RSA: "za",
  RUS: "ru", SCO: "gb-sct", SEN: "sn", SRB: "rs", SVK: "sk", SVN: "si",
  SWE: "se", SUI: "ch", SYR: "sy", TAN: "tz", THA: "th", TOG: "tg",
  TRI: "tt", TUN: "tn", TUR: "tr", UAE: "ae", UGA: "ug", UKR: "ua",
  URU: "uy", USA: "us", UZB: "uz", VEN: "ve", VIE: "vn", WAL: "gb-wls",
  ZAM: "zm",
};

/** Normalized team name → ISO 3166-1 alpha-2 (covers code variants/aliases). */
const NAME_TO_ISO2: Record<string, string> = {
  algeria: "dz", argentina: "ar", australia: "au", austria: "at",
  belgium: "be", bosniaherzegovina: "ba", brazil: "br", caboverde: "cv",
  canada: "ca", colombia: "co", congodr: "cd", cotedivoire: "ci",
  croatia: "hr", curacao: "cw", czechia: "cz", czechrepublic: "cz",
  ecuador: "ec", egypt: "eg", england: "gb-eng", france: "fr",
  germany: "de", ghana: "gh", haiti: "ht", iran: "ir", iraq: "iq",
  japan: "jp", jordan: "jo", korearepublic: "kr", southkorea: "kr",
  northkorea: "kp", mexico: "mx", morocco: "ma", netherlands: "nl",
  newzealand: "nz", nigeria: "ng", norway: "no", panama: "pa",
  paraguay: "py", portugal: "pt", qatar: "qa", saudiarabia: "sa",
  scotland: "gb-sct", senegal: "sn", southafrica: "za", spain: "es",
  sweden: "se", switzerland: "ch", tunisia: "tn", turkiye: "tr",
  turkey: "tr", usa: "us", unitedstates: "us", uruguay: "uy",
  uzbekistan: "uz", wales: "gb-wls",
};

const norm = (n: string) =>
  n.toLowerCase().replace(/\band\b/g, "").replace(/[^a-z]/g, "");

/** ISO alpha-2 / subdivision slug for a team, or null if we can't map it. */
export function flagIso(team: { code: string; name: string }): string | null {
  const byCode = team.code && CODE_TO_ISO2[team.code.toUpperCase()];
  if (byCode) return byCode;
  const byName = team.name && NAME_TO_ISO2[norm(team.name)];
  return byName || null;
}

/** flagcdn SVG URL (scales cleanly at any size, supports gb-xxx subdivisions). */
export const flagSrc = (iso: string): string => `https://flagcdn.com/${iso}.svg`;
