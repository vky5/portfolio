# Portfolio Redesign — Proposed Changes

Goal: make the portfolio read as the work of a **systems engineer with serious design taste** — the
Rauno Freiberg / Vercel school of craft: restrained surfaces, precise typography, motion that is
felt rather than seen, and details that reward attention. The current site has energy, but it
signals "themed template" more than "engineer who sweats details."

The two guiding rules, borrowed from Rauno's own writing (rauno.me, "Invisible Details"):

1. **Interfaces should feel calm.** Nothing pulses, glows, or loops forever. Motion happens in
   response to *you*, then gets out of the way.
2. **Craft is in the defaults.** Focus rings, selection color, scroll behavior, keyboard access,
   load states — the things most portfolios ignore are exactly what makes one memorable to
   engineers who look closely.

> **Context:** branch `redesign/minimal-emerald` already contains one commit of a vertical-scroll
> redesign (3D hero, reveal animations, marquee). This doc reviews `main` (the horizontal deck).
> Decision needed before implementing: resume that branch, or apply this plan fresh on `main`.
> See "Open decisions" at the bottom.

---

## 1. The big structural change: kill the horizontal slide deck

**Current:** `page.tsx` renders five full-screen slides in a horizontal snap-scroll container with
a floating pill navigation and a bottom progress bar. Each slide has its own inner vertical scroll.

**Why it hurts:**
- Nested scrolling (vertical inside horizontal) is disorienting; scroll direction changes meaning
  depending on where your cursor is. This is the single biggest "harder to read and navigate" issue.
- Recruiters skim. A deck hides 80% of your content behind interactions they won't perform.
- Browser-native affordances break: no scrubbing, no sensible print, back/forward feels weird,
  `?slide=` URLs instead of `#anchors`, and content can't be found with Ctrl+F.
- No serious engineering-brand site (vercel.com, linear.app, rauno.me, paco.me) uses a slide deck.
  They all use a **single calm vertical page** and put the craft into the details.

**Proposed:**
- One vertical page: Hero → Experience → Projects → Writing → Contact, each a `<section id>`.
- Sticky top nav (name left, section links + theme toggle right) with a **scroll-spy underline**
  that slides between active links (the classic Vercel tab-hover animation — an absolutely
  positioned highlight that follows the hovered/active item with a spring).
- Replace `?slide=blogs` URLs with `#writing` hash anchors; `blog/[slug]`'s Back button goes to
  `/#writing`.
- Keep one **signature moment** of horizontal motion if you miss it: the Projects row can be a
  pinned horizontal scroll-within-vertical-scroll gallery (GSAP-style, doable with framer-motion
  `useScroll` + `useTransform`). One controlled moment > the whole site sideways.

---

## 2. Visual language: from "hacker theme" to "engineered surface"

### 2.1 Drop the terminal cosplay
`./experience`, `root@vky5:~/career`, fake macOS window chrome with traffic lights, `$ cat role`,
`EXPLORER` sidebars. This is the most common dev-portfolio trope and reads junior, not systems.
Actual systems credibility comes from **content** (numbers, architecture, incidents, trade-offs),
not from terminal decoration.

Keep the *spirit* with restraint:
- Use `Geist Mono` for **metadata only**: dates, section indices (`01 — Experience`), tech tags,
  stats. Mono-as-seasoning is exactly the Vercel look.
- Section headers become quiet: small mono kicker (`01 / Experience`) above a large sans heading.
  No `./` prefixes, no `root@` lines, no fake prompts.

### 2.2 Color system
- **Base:** keep the near-black neutral base (`oklch(0.12 0 0)`) — it's good. Add one more surface
  step so cards don't rely on `white/5` washes everywhere.
- **Accent:** currently orange `oklch(0.7 0.25 45)`. Previous session direction was **emerald**;
  the redesign branch commit then "restored orange/black." Pick one and commit (open decision
  below). Either works — what matters is the *dosage* (see 2.3).
- **Kill every hardcoded `rgba(255,165,0,…)` shadow.** They appear in Navigation, ProgressBar,
  Projects, Experience, Contact, Home. If the accent ever changes, the site breaks in ten places.
  Use `var(--primary)` / Tailwind theme tokens exclusively.
- **Light mode:** `layout.tsx` sets `forcedTheme="dark"` even though `next-themes` and a
  `ThemeToggle` component exist. Ship a real light theme. A portfolio that nails *both* modes is
  itself a craft signal (Rauno's site does; so does vercel.com). This mostly means defining the
  `:root` light palette in `globals.css` and removing `forcedTheme`.

### 2.3 Accent dosage — the single biggest visual fix
Right now the accent is used for: headings, glows, badges, borders, dots, timeline lines, button
fills, link hovers, underlines. When everything is orange, nothing is.

Rule: **accent appears only on (a) interactive affordances and (b) one focal element per screen.**
Everything else is `foreground` / `muted-foreground` / borders. Badges become neutral
(`border-border text-muted-foreground`), headings become `foreground`, glows disappear entirely
(`shadow-[0_0_15px_…]` — all of them). The site instantly looks 3× more expensive.

### 2.4 Typography & rhythm
- Headings: current `font-light` at 6xl–7xl feels early-2020 template. Go **medium/semibold with
  tight tracking** (`tracking-tight`, `text-balance`) — the Geist/Vercel headline voice.
- Body: cap line length at `max-w-[65ch]` everywhere prose appears (hero paragraphs currently
  stretch too wide on large screens).
- Establish a spacing scale between sections (e.g. `py-24 md:py-32`, consistent) instead of
  per-slide `min-h-[calc(100vh-160px)]` centering. Sections sized by content read better than
  sections stretched to viewport height.
- Use tabular figures (`tabular-nums`) for dates/stats so columns align.

---

## 3. Section-by-section

### 3.1 Hero
Current: "Hello, I'm Vaibhav / Software **Engineer**" split two-column with a pulsing dot and
skill badges popping in with `scale: 0`.

- Rewrite the copy to be **specific and quantified**. "Building scalable infrastructure and
  distributed systems" is what every portfolio says. Better shape:
  *"I design and run distributed systems — Kubernetes operators, CI/CD platforms, and the
  full-stack apps on top of them."* followed by one line of proof (internship, project, numbers).
- Replace the pulsing dot with a **status line**: small mono row like
  `● Available for backend/infra roles · Chandigarh, IN · UTC+5:30` — one subtle element that
  reads "human, current, online". (A live `/api/now` — currently playing / last commit — is a
  cooler upgrade later.)
- Skill badges: drop the `scale: 0 → 1` pop-in cascade. Either a plain wrapped row of mono tags,
  or fold them into the "Systems strip" idea below.
- **Signature moment (pick one, not all):**
  - a. Interactive **architecture diagram as hero art**: nodes (client → LB → services → queue →
    DB) drawn with SVG lines that animate packets flowing; hovering a node highlights its path.
    Nothing says systems engineer better, and it doubles as the design flex.
  - b. The **3D icosahedron** already built on the redesign branch (`Hero3D.tsx`).
  - c. A quiet **canvas dot-grid** that displaces slightly around the cursor (Vercel-homepage
    style, very cheap, very effective).

### 3.2 Experience
Current: "EXPLORER" file-tree sidebar + fake terminal window detail pane.

- Replace with a **master–detail or single timeline** with the chrome stripped: left column is a
  slim list (period in mono, company, role), right column is the detail. Keep the click-to-select
  interaction — it's good — but style it like Linear settings, not VS Code.
- Animate detail swaps with a subtle crossfade + 4px slide (80–150ms), not `scale: 0.98` zoom.
- **Content upgrade (matters more than styling):** every highlight bullet should carry a number
  or a concrete artifact: "cut deploy time 14min → 3min", "operator reconciling 200+ CRs",
  "wrote the runbook for X". Quantified bullets are the strongest systems-engineer signal on the
  whole site.
- The detail pane hardcodes `bg-zinc-950 text-white` — it's theme-locked. Use tokens so light
  mode works.

### 3.3 Projects — make this the centerpiece
Current: alternating left/right timeline with infinite ping-pulsing dots and a generic
gradient-icon "Architecture Preview" box.

- **Case-study rows, not timeline.** Each project: big title, one-line problem statement, 2–3
  outcome bullets, tech in mono, links. Alternate image/text sides if you like, but drop the
  center line + pulsing dots (infinite `repeat: Infinity` animations are the opposite of calm).
- The "Architecture Preview" box is the wasted opportunity: for your 2–3 flagship projects,
  replace the icon-in-gradient-box with an **actual mini architecture diagram** (SVG, animated
  on hover/in-view: connection lines draw in, request dots travel between services). This is the
  feature people will remember, and it's honest — it shows how the thing actually works.
- Tag filters: fine to keep, but animate list changes with `AnimatePresence` layout animations
  (cards slide/settle rather than blink). Also filters currently rebuild from all tags — cap the
  visible filters to your 6–8 real categories or it will sprawl.
- Add a **GitHub link with live stars/commit data** (fetched server-side, cached) for flagship
  repos — small live data = systems flavor.

### 3.4 Blogs → "Writing"
Current: card grid with colored type icons, filters, hover shadow.

- Rename section to **Writing**. Consider a **list layout instead of cards**: title, one-line
  excerpt, date + read-time in mono, hover reveals an arrow. Lists read faster than card grids
  and look dramatically more editorial (see paco.me, rauno.me/craft).
- Keep type filters only if you'll have >8 posts; otherwise they're chrome.
- The per-type icon colors (purple/green/blue) fight the palette — one neutral icon or a small
  mono tag (`article`, `book notes`, `external ↗`) instead.
- Blog reading page (`NativeBlogLayout`) is genuinely good already (TOC + scroll-spy). Polish:
  - `.prose` overrides in `globals.css` lean on `!important` heavily — refactor into the
    typography plugin config so they're overridable.
  - Show a thin **reading progress bar** at the top of blog pages (this is where a progress bar
    belongs — not on the homepage).
  - Global scrollbar hiding (`body::-webkit-scrollbar { display: none }`) hurts long-form reading;
    scope scrollbar hiding to the deck (or delete it with the deck) and let blog pages show a
    normal scrollbar.
  - `blog/[slug]` fetches **all** blogs client-side then filters by slug. Make it a server
    component fetching one post — faster, and enables per-post `<title>`/OG metadata (see §5).

### 3.5 Contact
Current: glassy form card + social icons.

- Simplify: one line of copy, an obvious `mailto:` styled email address (people distrust contact
  forms), the form as secondary, GitHub/LinkedIn as quiet text links with `↗`.
- Add a **copy-email button** with the classic craft micro-interaction: click → icon morphs to a
  checkmark, "Copied" fades in, reverts after 1.5s. Small, memorable, exactly the Rauno detail.
- Success state: animate the button width/label with a layout transition instead of a flat color
  swap to green.

### 3.6 Navigation chrome
- **Remove the admin lock icon from the public nav** (`Navigation.tsx`). Shipping a visible door
  to your admin panel signals the opposite of security-mindedness. `/admin` is reachable by URL;
  that's enough. (Related: `Blogs.tsx` trusts `sessionStorage.admin_token` for showing edit
  buttons — fine as pure UI sugar, but make sure the API actually enforces auth server-side.)
- Delete the bottom `ProgressBar` with the deck.
- **⌘K command palette** (optional, high signal): navigate sections, open projects/posts, copy
  email, toggle theme. It's the engineer-portfolio flex that actually gets used, and it's ~150
  lines with `cmdk`.

---

## 4. Motion principles (apply everywhere)

Current motion issues: entrance animations on *everything* (opacity+y on every block), infinite
pulse loops (hero dot, project timeline dots), `scale: 0` pop-ins, 0.8s durations, glows as
hover states.

- **Durations 150–300ms** for UI response; ≤600ms for hero entrances. 0.8s everywhere feels
  syrupy.
- **Ease-out for entrances** (`[0.21, 0.47, 0.32, 0.98]` or similar), springs for gestures.
- Entrance animations: hero only on load; everything else animates **once** via
  `whileInView` + `viewport={{ once: true }}` with small distances (8–16px, not 50).
- **Zero infinite animations.** The only permanently-moving pixel allowed is an optional status
  dot at 1 opacity-pulse per 2s — and even that's negotiable.
- Hover states change **color/border/underline**, not scale (except imagery). No glow shadows.
- Respect `prefers-reduced-motion` globally (framer-motion `MotionConfig reducedMotion="user"` —
  one line, big accessibility signal).
- One or two **signature interactions** max (hero art + email copy, or hero art + projects
  gallery). Craft is concentration, not coverage.

---

## 5. Engineering credibility under the hood

The people you most want to impress **will** view source and Lighthouse it. Right now the site is
100% client-rendered with `useEffect`+`fetch` waterfalls and spinner screens — for a systems
engineer's own site, this *is* the portfolio.

- **Server components for data.** Experience, Projects, Blogs are read-heavy and change rarely:
  fetch in RSC (or even statically with revalidation via `next: { revalidate }`), pass data down.
  Result: content is in the initial HTML — no spinners, no layout shift, crawlable, fast on
  mobile networks.
- **Kill full-screen loaders**; where client fetches remain (admin), use skeletons.
- **Per-page metadata + OG images.** Currently one global title; blog posts share it. Add
  `generateMetadata` for `blog/[slug]` and a dynamic OG image via `next/og` (dark card, mono
  accents, post title) — your links will look sharp on X/LinkedIn, which is where a portfolio
  actually circulates.
- `next/image` for covers (currently raw `<img>` — Next even warns about LCP on these).
- Add `sitemap.ts`, `robots.ts`, favicon set, and structured data (`Person` + `BlogPosting`
  JSON-LD). Cheap, and it's the kind of completeness engineers notice.
- **Accessibility pass:** icon-only buttons in `Navigation.tsx` need `aria-label`s; visible
  `:focus-visible` rings (accent ring on neutral surfaces — a craft moment in itself); the deck's
  keyboard navigation problem disappears with the deck.
- Repo hygiene: `test_db.js` is sitting untracked in the repo root — delete or move it; make sure
  it never lands in git with credentials inside.
- Optional flex: a tiny `/humans.txt` or an ASCII console easter egg (`console.log` box greeting
  fellow engineers who open devtools) — costs nothing, universally loved.

---

## 6. Content additions that say "systems engineer"

Design gets attention; these keep it:

1. **Numbers in every experience/project bullet** (latency, scale, time saved, uptime).
2. **Architecture diagrams** for flagship projects (§3.3) — interactive SVG beats screenshots.
3. A short **"How this site works"** footer link or post: Next 16 RSC, MongoDB, Cloudinary,
   deploy pipeline, with a small diagram. Meta, but exactly the systems-engineer move.
4. **Uses / stack page** (optional): tools, dotfiles, homelab if any.
5. Writing filters by *topic* (Kubernetes, distributed systems, CI/CD) rather than *format* —
   topics market expertise, formats don't.

---

## 7. Suggested implementation order

| Phase | Scope | Impact |
|-------|-------|--------|
| 1 | Vertical layout + sticky nav w/ scroll-spy underline, delete deck/ProgressBar/lock icon | Navigation + first impression |
| 2 | De-theme: strip terminal chrome, accent dosage rules, kill glows/hardcoded rgba, typography pass | "Looks expensive" |
| 3 | Motion pass: once-only reveals, durations, reduced-motion, remove infinite loops | Calm + fluid |
| 4 | RSC data fetching, metadata/OG, next/image, a11y, light mode | Engineering cred |
| 5 | Signature moments: hero art (diagram/3D/dot-grid), project architecture diagrams, email-copy micro-interaction, ⌘K | Memorable |
| 6 | Content rewrite: quantified bullets, section copy, "How this site works" | Substance |

---

## 8. Open decisions (need your call before implementing)

1. **Accent color:** emerald (previous session's direction) vs orange (current, and the redesign
   branch's hero "restored orange/black"). My take: either, at low dosage — orange/black is more
   distinctive, emerald is more Linear-refined. Pick once, tokens make it a one-line change.
2. **Branch strategy:** resume `redesign/minimal-emerald` (already has vertical layout, Hero3D,
   Reveal, Marquee) and re-skin per this doc, or start clean from `main`. Resuming saves work if
   you liked its bones.
3. **Hero signature moment:** architecture-diagram art (my pick — most "systems"), 3D icosahedron
   (already built), or interactive dot-grid (cheapest).
4. **Light mode:** ship now (my recommendation) or stay dark-only and remove the toggle component.
