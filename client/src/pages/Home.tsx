/**
 * Sports AI Hub — Home Page
 * Design: "Signal & Pitch" — Broadcast Brutalism
 * Dark canvas #0D0F14, Electric Signal Green #00FF87
 * Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (code)
 */

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Github,
  Zap,
  Activity,
  Target,
  Eye,
  ChevronRight,
  Star,
  GitFork,
  Users,
  TrendingUp,
  Code2,
  Play,
} from "lucide-react";

// ── Asset URLs ──────────────────────────────────────────────────────────────
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663160395802/PvBxFQLSvfscabrsLuaXtD/hero-bg-NBTbNQ5iSg75PYGD369qSe.webp";
const LOGO_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663160395802/PvBxFQLSvfscabrsLuaXtD/logo-icon-Pr9YxKSEvJb6r6nJETEekv.webp";
const WNBA_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310519663160395802/PvBxFQLSvfscabrsLuaXtD/wnba-card-SAhDnf7XRFmeGD3TdkN53a.webp";
const COMMENTATOR_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310519663160395802/PvBxFQLSvfscabrsLuaXtD/commentator-card-gTCcK8ZtWn8W6CaG3GNVXN.webp";
const PICKLEBALL_CARD = "https://d2xsxph8kpxj0f.cloudfront.net/310519663160395802/PvBxFQLSvfscabrsLuaXtD/pickleball-card-2aG8gJW6Gesn56r2fTCh8B.webp";

// ── Ticker data ─────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "⚽ FIFA World Cup 2026 — 48 Teams, 104 Matches",
  "🏀 WNBA Player Gravity Analytics — Now Open Source",
  "🎾 Pickleball Court CV — 12 Lines Detected",
  "🤖 LLM Match Commentator — Bilingual EN/ES Live",
  "📈 Sports AI Market — $29.7B by 2030",
  "🏈 NFL Next Gen Stats — 100M+ data points/game",
  "⚡ Phase 6 Prototypes — 3 Tools Shipped",
  "🌍 Contributors Wanted — 8 Open Issues",
  "🏋️ Wearable Biometrics — Fatigue AI in Progress",
  "🎯 Awesome Sports AI — Star us on GitHub",
];

// ── Roadmap phases ──────────────────────────────────────────────────────────
const ROADMAP = [
  {
    phase: "Phase 1–3",
    title: "Foundation",
    status: "done",
    items: ["Curated tool taxonomy", "Enterprise decomposition docs", "Contribution framework"],
  },
  {
    phase: "Phase 4–5",
    title: "Community",
    status: "done",
    items: ["GitHub issue templates", "Contributor onboarding guide", "Sports tag taxonomy"],
  },
  {
    phase: "Phase 6",
    title: "Prototypes",
    status: "active",
    items: ["llm-match-commentator", "wnba-gravity-mapper", "pickleball-court-mapper"],
  },
  {
    phase: "Phase 7",
    title: "Integrations",
    status: "upcoming",
    items: ["StatsBomb open data connector", "Wearable biometrics bridge", "Video pose estimation"],
  },
  {
    phase: "Phase 8",
    title: "Scale",
    status: "planned",
    items: ["Multi-sport benchmark suite", "Community leaderboard", "Enterprise API bridge"],
  },
];

// ── Prototype tools ─────────────────────────────────────────────────────────
const PROTOTYPES = [
  {
    id: "llm-match-commentator",
    title: "LLM Match Commentator",
    sport: "⚽ Football",
    tag: "NLP · LLM",
    desc: "RAG-powered bilingual commentary engine for FIFA World Cup 2026 match events. Generates English and Spanish commentary in real-time from structured event data.",
    image: COMMENTATOR_CARD,
    stack: ["Python", "OpenAI API", "JSON events"],
    cmd: "python3 commentator.py",
    github: "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/llm-match-commentator",
    highlight: "18' — GOAL! Balogun rises to meet the corner — USA leads 1-0!",
  },
  {
    id: "wnba-gravity-mapper",
    title: "WNBA Gravity Mapper",
    sport: "🏀 Basketball",
    tag: "Analytics · CV",
    desc: "Calculates player gravity scores from tracking data — how much defensive attention each player draws. Visualizes heatmaps on a half-court diagram.",
    image: WNBA_CARD,
    stack: ["Python", "Pandas", "Matplotlib", "SciPy"],
    cmd: "python3 gravity_mapper.py",
    github: "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/wnba-gravity-mapper",
    highlight: "Caitlin Clark: 3.40 gravity score — highest on the court",
  },
  {
    id: "pickleball-court-mapper",
    title: "Pickleball Court Mapper",
    sport: "🎾 Racquet",
    tag: "Computer Vision",
    desc: "Detects court lines from images using OpenCV Hough transforms. Annotates boundaries, Kitchen/NVZ zones, and service boxes. Works on any court image.",
    image: PICKLEBALL_CARD,
    stack: ["Python", "OpenCV", "Matplotlib", "NumPy"],
    cmd: "python3 court_mapper.py",
    github: "https://github.com/moose-lab/awesome-sports-ai/tree/main/prototypes/pickleball-court-mapper",
    highlight: "12 line segments detected — Kitchen zones identified",
  },
];

// ── Trending sports ─────────────────────────────────────────────────────────
const TRENDING = [
  { sport: "Football / Soccer", icon: "⚽", heat: 98, reason: "FIFA World Cup 2026 — US, Canada, Mexico" },
  { sport: "Basketball (WNBA)", icon: "🏀", heat: 91, reason: "Caitlin Clark effect + gravity analytics boom" },
  { sport: "Pickleball", icon: "🎾", heat: 85, reason: "Fastest growing US sport — 36M players" },
  { sport: "American Football", icon: "🏈", heat: 82, reason: "NFL Next Gen Stats + AI referee tech" },
  { sport: "Athletics / Track", icon: "🏃", heat: 74, reason: "LA 2028 Olympics prep + wearable biometrics" },
  { sport: "Esports", icon: "🎮", heat: 70, reason: "AI coaching tools + real-time strategy engines" },
];

// ── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Market Size 2030", value: "$29.7B", icon: TrendingUp },
  { label: "Tools Curated", value: "48+", icon: Code2 },
  { label: "Phase 6 Prototypes", value: "3", icon: Zap },
  { label: "Open Issues", value: "8", icon: Target },
];

// ── Counter hook ─────────────────────────────────────────────────────────────
function useCountUp(target: string, duration = 1200) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const num = parseFloat(target.replace(/[^0-9.]/g, ""));
          const prefix = target.match(/^\$/) ? "$" : "";
          const suffix = target.replace(/[\d.$]/g, "");
          const steps = 40;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            const val = (num * step) / steps;
            setDisplay(`${prefix}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}${suffix}`);
            if (step >= steps) { clearInterval(timer); setDisplay(target); }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { display, ref };
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  const { display, ref } = useCountUp(value);
  return (
    <div ref={ref} className="flex flex-col gap-1 p-5 rounded-lg bg-[#1A1E2A] border border-white/8">
      <Icon className="w-5 h-5 text-[#00FF87] mb-1" />
      <div
        className="text-3xl font-bold text-white"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {display}
      </div>
      <div className="text-xs text-gray-400 uppercase tracking-widest">{label}</div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeProto, setActiveProto] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tickerText = TICKER_ITEMS.join("   ·   ");
  const doubledTicker = `${tickerText}   ·   ${tickerText}`;

  return (
    <div className="min-h-screen bg-[#0D0F14] text-white overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0D0F14]/95 backdrop-blur-xl border-b border-white/8" : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={LOGO_ICON} alt="Sports AI Hub" className="w-8 h-8" />
            <span
              className="text-lg font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Sports<span className="text-[#00FF87]">AI</span>Hub
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#prototypes" className="hover:text-[#00FF87] transition-colors">Prototypes</a>
            <a href="#roadmap" className="hover:text-[#00FF87] transition-colors">Roadmap</a>
            <a href="#trending" className="hover:text-[#00FF87] transition-colors">Trending</a>
            <a href="#contribute" className="hover:text-[#00FF87] transition-colors">Contribute</a>
          </div>
          <a
            href="https://github.com/moose-lab/awesome-sports-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="bg-[#00FF87] text-[#0D0F14] hover:bg-[#00CC6A] font-semibold gap-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Github className="w-4 h-4" />
              Star on GitHub
            </Button>
          </a>
        </div>
      </nav>

      {/* ── TICKER ───────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-40 h-7 bg-[#00FF87]/10 border-b border-[#00FF87]/20 flex items-center overflow-hidden">
        <div className="ticker-wrap flex-1">
          <div className="ticker-content">
            <span className="text-[10px] font-mono text-[#00FF87] tracking-wide">
              {doubledTicker}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 shrink-0">
          <div className="pulse-dot" />
          <span className="text-[10px] font-mono text-[#00FF87] font-bold">LIVE</span>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-28">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_BG}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0F14] via-[#0D0F14]/80 to-[#0D0F14]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14] via-transparent to-[#0D0F14]/60" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-6 animate-fade-up">
              <span className="phase-badge phase-badge-active">
                <span className="pulse-dot w-1.5 h-1.5" />
                Phase 6 — Live
              </span>
              <span className="phase-badge phase-badge-upcoming">
                FIFA World Cup 2026 Ready
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-6xl md:text-7xl font-extrabold leading-[1.05] mb-6 animate-fade-up delay-100"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Build the tools<br />
              <span className="text-[#00FF87] signal-glow-text">pros use.</span><br />
              Ship them open.
            </h1>

            <p className="text-lg text-gray-300 max-w-xl mb-8 leading-relaxed animate-fade-up delay-200">
              The open-source command center for sports AI builders. Curated tools,
              enterprise-decomposed prototypes, and a 2026 roadmap targeting the hottest
              sports in the world.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12 animate-fade-up delay-300">
              <a
                href="https://github.com/moose-lab/awesome-sports-ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-[#00FF87] text-[#0D0F14] hover:bg-[#00CC6A] font-bold gap-2 text-base h-12 px-7"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </Button>
              </a>
              <a href="#prototypes">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:border-[#00FF87]/60 hover:text-[#00FF87] font-semibold gap-2 text-base h-12 px-7 bg-transparent"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <Play className="w-4 h-4" />
                  See Prototypes
                </Button>
              </a>
            </div>

            {/* GitHub stats */}
            <div className="flex items-center gap-6 text-sm text-gray-400 animate-fade-up delay-400">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#F59E0B]" />
                <span>Star the repo</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-[#00FF87]" />
                <span>Fork & contribute</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#3B82F6]" />
                <span>8 open issues</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/8">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTOTYPES ───────────────────────────────────────────────────── */}
      <section id="prototypes" className="py-24">
        <div className="container">
          {/* Section header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="phase-badge phase-badge-active">Phase 6</span>
              <span className="text-xs font-mono text-gray-500">3 tools shipped</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Live Prototypes
            </h2>
            <p className="text-gray-400 max-w-xl">
              Real, runnable code. Each tool decomposes an enterprise-grade sports AI
              capability into an open-source building block.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {PROTOTYPES.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveProto(i)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-160 ${
                  activeProto === i
                    ? "bg-[#00FF87] text-[#0D0F14]"
                    : "bg-[#1A1E2A] text-gray-400 hover:text-white border border-white/8"
                }`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {p.sport}
              </button>
            ))}
          </div>

          {/* Active prototype */}
          {PROTOTYPES.map((proto, i) => (
            <div
              key={proto.id}
              className={`transition-all duration-300 ${i === activeProto ? "block" : "hidden"}`}
            >
              <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden aspect-video card-signal">
                  <img
                    src={proto.image}
                    alt={proto.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F14]/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="terminal">
                      <div className="terminal-content">
                        <span className="comment"># {proto.highlight}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-[#00FF87]/10 text-[#00FF87] border-[#00FF87]/20 text-xs font-mono">
                      {proto.tag}
                    </Badge>
                    <span className="text-xs text-gray-500 font-mono">{proto.sport}</span>
                  </div>
                  <h3
                    className="text-3xl font-bold mb-3"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {proto.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{proto.desc}</p>

                  {/* Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proto.stack.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded text-xs font-mono bg-[#1A1E2A] text-gray-300 border border-white/8"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Terminal */}
                  <div className="terminal mb-6">
                    <div className="terminal-content">
                      <div><span className="comment"># Clone and run</span></div>
                      <div><span className="cmd">$ </span>git clone github.com/moose-lab/awesome-sports-ai</div>
                      <div><span className="cmd">$ </span>cd prototypes/{proto.id}</div>
                      <div><span className="cmd">$ </span>{proto.cmd}</div>
                    </div>
                  </div>

                  <a href={proto.github} target="_blank" rel="noopener noreferrer">
                    <Button
                      className="bg-[#00FF87] text-[#0D0F14] hover:bg-[#00CC6A] font-bold gap-2"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      <Github className="w-4 h-4" />
                      View Source
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* All prototype cards grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {PROTOTYPES.map((proto, i) => (
              <div
                key={proto.id}
                className="card-signal rounded-xl bg-[#1A1E2A] overflow-hidden cursor-pointer"
                onClick={() => setActiveProto(i)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={proto.image}
                    alt={proto.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[#00FF87]">{proto.sport}</span>
                    <span className="text-xs text-gray-600">·</span>
                    <span className="text-xs font-mono text-gray-500">{proto.tag}</span>
                  </div>
                  <h4
                    className="font-bold text-white mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {proto.title}
                  </h4>
                  <p className="text-xs text-gray-400 line-clamp-2">{proto.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING SPORTS ──────────────────────────────────────────────── */}
      <section id="trending" className="py-24 bg-[#0F1118]">
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#00FF87]" />
              <span className="text-xs font-mono text-[#00FF87] uppercase tracking-widest">2026 Signal</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Hottest Sports for AI
            </h2>
            <p className="text-gray-400 max-w-xl">
              Where the data is richest, the market is biggest, and the open-source
              opportunity is most underserved.
            </p>
          </div>

          <div className="space-y-4">
            {TRENDING.map((item, i) => (
              <div
                key={item.sport}
                className="flex items-center gap-4 p-5 rounded-xl bg-[#1A1E2A] border border-white/8 hover:border-[#00FF87]/30 transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-3xl w-10 text-center">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className="font-bold text-white"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {item.sport}
                    </span>
                    <span className="text-xs font-mono text-gray-500">{item.reason}</span>
                  </div>
                  {/* Heat bar */}
                  <div className="h-1.5 bg-[#0D0F14] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${item.heat}%`,
                        background: `linear-gradient(90deg, #00FF87, ${item.heat > 90 ? "#F59E0B" : "#00CC6A"})`,
                      }}
                    />
                  </div>
                </div>
                <div
                  className="text-2xl font-bold tabular-nums shrink-0"
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: item.heat > 90 ? "#00FF87" : item.heat > 80 ? "#F59E0B" : "#6B7280",
                  }}
                >
                  {item.heat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────────────────────────────────── */}
      <section id="roadmap" className="py-24">
        <div className="container">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-[#00FF87]" />
              <span className="text-xs font-mono text-[#00FF87] uppercase tracking-widest">Project Roadmap</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              From Curation to Platform
            </h2>
            <p className="text-gray-400 max-w-xl">
              Eight phases from a curated list to a full open-source sports AI platform.
              Phase 6 is live. Phase 7 is next.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-white/8 hidden md:block" />

            <div className="space-y-6">
              {ROADMAP.map((phase, i) => (
                <div key={phase.phase} className="relative flex gap-6 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  {/* Dot */}
                  <div className="hidden md:flex flex-col items-center shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono font-bold z-10 ${
                        phase.status === "active"
                          ? "bg-[#00FF87] text-[#0D0F14] signal-glow"
                          : phase.status === "done"
                          ? "bg-[#1A1E2A] border border-[#00FF87]/40 text-[#00FF87]"
                          : phase.status === "upcoming"
                          ? "bg-[#1A1E2A] border border-[#F59E0B]/40 text-[#F59E0B]"
                          : "bg-[#1A1E2A] border border-white/10 text-gray-600"
                      }`}
                    >
                      {phase.status === "done" ? "✓" : phase.status === "active" ? "▶" : "○"}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 p-6 rounded-xl border card-signal ${
                      phase.status === "active"
                        ? "bg-[#00FF87]/5 border-[#00FF87]/30"
                        : "bg-[#1A1E2A] border-white/8"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`phase-badge ${
                          phase.status === "active"
                            ? "phase-badge-active"
                            : phase.status === "upcoming"
                            ? "phase-badge-upcoming"
                            : phase.status === "done"
                            ? "phase-badge-active"
                            : "phase-badge-planned"
                        }`}
                      >
                        {phase.status === "active" && <span className="pulse-dot w-1.5 h-1.5" />}
                        {phase.phase}
                      </span>
                      <h3
                        className="font-bold text-lg text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {phase.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs font-mono px-2.5 py-1 rounded bg-[#0D0F14] text-gray-300 border border-white/8"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTRIBUTE ───────────────────────────────────────────────────── */}
      <section id="contribute" className="py-24 bg-[#0F1118]">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-4 h-4 text-[#00FF87]" />
                <span className="text-xs font-mono text-[#00FF87] uppercase tracking-widest">Open Source</span>
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Claim your issue.<br />
                <span className="text-[#00FF87]">Ship your tool.</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Every prototype in this project started as a GitHub issue. Pick a sport,
                pick a capability, and build the open-source version of what the pros pay
                millions for. The community will use it.
              </p>

              <div className="terminal mb-8">
                <div className="terminal-content">
                  <div><span className="comment"># How to contribute</span></div>
                  <div><span className="cmd">$ </span>gh issue list --repo moose-lab/awesome-sports-ai</div>
                  <div><span className="cmd">$ </span>gh issue create --title "feat: [sport] [tool-name]"</div>
                  <div><span className="cmd">$ </span>gh pr create --fill</div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href="https://github.com/moose-lab/awesome-sports-ai/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="bg-[#00FF87] text-[#0D0F14] hover:bg-[#00CC6A] font-bold gap-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <Target className="w-4 h-4" />
                    Browse Open Issues
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </a>
                <a
                  href="https://github.com/moose-lab/awesome-sports-ai/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:border-[#00FF87]/60 hover:text-[#00FF87] bg-transparent font-semibold"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Read Guide
                  </Button>
                </a>
              </div>
            </div>

            {/* Contribution steps */}
            <div className="space-y-4">
              {[
                { step: "01", title: "Pick a sport", desc: "Football, WNBA, Pickleball, Athletics, Esports — choose what you know." },
                { step: "02", title: "Identify the enterprise tool", desc: "What does a $50K/yr analytics platform do that developers can't access?" },
                { step: "03", title: "Build the mono-tool", desc: "One script, one input, one output. Runnable in under 5 minutes." },
                { step: "04", title: "Open a PR", desc: "Add it to the prototypes/ directory with a README and sample data." },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex gap-4 p-5 rounded-xl bg-[#1A1E2A] border border-white/8 hover:border-[#00FF87]/30 transition-colors"
                >
                  <div
                    className="text-3xl font-extrabold text-[#00FF87]/20 shrink-0 w-12 tabular-nums"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <div
                      className="font-bold text-white mb-1"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-400">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRD SECTION ──────────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/8">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-[#00FF87]" />
              <span className="text-xs font-mono text-[#00FF87] uppercase tracking-widest">Product Spec</span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              The PRD is the playbook.
            </h2>
            <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
              Every phase, every prototype, every contribution guideline is driven by a
              single actionable PRD. Read it, fork it, execute it.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                {
                  title: "Vision",
                  desc: "Decompose $50K/yr enterprise sports AI tools into open-source mono-tools that any developer can run in 5 minutes.",
                  icon: "🎯",
                },
                {
                  title: "Success Metrics",
                  desc: "50 GitHub stars in 30 days · 3 community prototypes in 60 days · 1 enterprise API bridge in 90 days.",
                  icon: "📈",
                },
                {
                  title: "North Star",
                  desc: "Every sports AI capability that costs $50K/yr should have a free, open-source alternative that a developer can run locally.",
                  icon: "⭐",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-xl bg-[#1A1E2A] border border-white/8 card-signal"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h4
                    className="font-bold text-white mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <a
                href="https://github.com/moose-lab/awesome-sports-ai/blob/main/docs/PRD-awesome-sports-ai-2026.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-[#00FF87] text-[#0D0F14] hover:bg-[#00CC6A] font-bold gap-2 text-base h-12 px-8"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Read the Full PRD
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={LOGO_ICON} alt="Sports AI Hub" className="w-7 h-7" />
              <span
                className="font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Sports<span className="text-[#00FF87]">AI</span>Hub
              </span>
              <span className="text-gray-600 text-sm">·</span>
              <span className="text-gray-500 text-sm">awesome-sports-ai</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a
                href="https://github.com/moose-lab/awesome-sports-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00FF87] transition-colors flex items-center gap-1"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://github.com/moose-lab/awesome-sports-ai/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00FF87] transition-colors"
              >
                Contributing
              </a>
              <a
                href="https://github.com/moose-lab/awesome-sports-ai/blob/main/docs/PRD-awesome-sports-ai-2026.md"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#00FF87] transition-colors"
              >
                PRD
              </a>
            </div>
            <div className="text-xs text-gray-600 font-mono">
              Built with awesome-sports-ai · Phase 6 · 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
