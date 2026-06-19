# Sports AI Hub — Design Brainstorm

## Three Approaches

**Approach A: "Mission Control"** (probability: 0.07)
Dark, data-dense command center aesthetic. Think NASA mission control meets sports analytics war room. Deep navy/charcoal backgrounds, amber/orange accent data readouts, monospace fonts for metrics, glowing status indicators.

**Approach B: "Field & Code"** (probability: 0.04)
Earthy, athletic meets technical. Turf-green and chalk-white with bold sans-serif type. Asymmetric editorial layout inspired by sports print media. Raw, honest, builder-first energy.

**Approach C: "Signal & Pitch"** (probability: 0.08)
High-contrast dark canvas with electric signal-green as the signature color. Inspired by radar screens and broadcast graphics. Diagonal cuts between sections, monospace terminal font for code snippets, bold condensed display type for headlines.

---

## Chosen Approach: **"Signal & Pitch"** (C)

### Design Movement
**Broadcast Brutalism** — the raw energy of live sports broadcast graphics fused with the precision of developer tooling. Think ESPN's bottom-line ticker meets a GitHub README, but elevated.

### Core Principles
1. **Signal over noise**: Every element earns its place. No decorative filler.
2. **Kinetic data**: Numbers, scores, and metrics feel alive — pulsing, counting, updating.
3. **Builder-first**: The UI respects developers. Code snippets are first-class citizens.
4. **Asymmetric tension**: Layouts break the grid intentionally to create visual momentum.

### Color Philosophy
A dark charcoal canvas (`#0D0F14`) that recedes, letting the electric signal-green (`#00FF87`) own every focal point. Amber (`#F59E0B`) for warnings and trending indicators. White for primary text. The green is unmistakably this brand's — it reads as "live feed" and "go signal" simultaneously.

### Layout Paradigm
Left-anchored asymmetric grid. Hero section uses a 60/40 split — text left, live visualization right. Tool cards use a masonry-style staggered grid, not uniform rows. The roadmap section uses a horizontal timeline that scrolls, not a vertical list.

### Signature Elements
1. **Ticker bar**: A scrolling live-score/news ticker at the very top, like a broadcast lower-third.
2. **Phase badges**: Pill-shaped phase indicators (Phase 1, Phase 6) with color-coded status dots.
3. **Terminal code blocks**: Styled like a real terminal with a blinking cursor for code examples.

### Interaction Philosophy
Interactions feel like live data feeds — hover states trigger subtle "signal pulse" animations. Cards don't just lift on hover; they briefly flash their accent border, as if receiving a data packet.

### Animation
- Entrance: Elements slide in from left with 40ms stagger, 200ms ease-out.
- Ticker: Continuous horizontal scroll at 40px/s, pauses on hover.
- Counters: Market size numbers count up on scroll-into-view.
- Cards: `scale(1.02)` + border flash on hover, 160ms ease-out.
- Phase dots: Subtle pulse animation (2s loop) for "in progress" items.

### Typography System
- **Display**: `Space Grotesk` (700, 800) — bold, geometric, technical without being cold.
- **Body**: `Inter` (400, 500) — clean and readable for dense content.
- **Code/Mono**: `JetBrains Mono` — for terminal blocks and metric readouts.
- Hierarchy: 72px hero → 40px section → 24px card title → 16px body → 12px label.

### Brand Essence
**Sports AI Hub: The open-source command center for builders who want to win.** Precise. Relentless. Open.

### Brand Voice
Headlines are direct and declarative — no fluff. "Build the tools pros use. Ship them open-source." CTAs are active: "Start Building", "View Prototype", "Claim Your Issue". No "Welcome to our website." No "Get started today."

### Wordmark & Logo
A stylized radar sweep icon — a quarter-circle arc with a dot at the tip, suggesting both a sports field corner and a signal broadcast. Clean, geometric, monochrome.

### Signature Brand Color
**Electric Signal Green** `#00FF87` — the color of a live "go" indicator on a broadcast desk.
