# JP Personal Site — Full Project Context

## What This Is
A new personal site for jpmarra.com replacing an existing Gatsby site. Single-page static site (HTML/CSS/vanilla JS), dark themed, minimal, monotyped. Hosted on GitHub Pages with custom domain via Squarespace DNS.

## Design Decisions (All Confirmed)

### Color Scheme
- Background: `#121212`
- Text: `#eeeeee` (warm white)
- Muted text: `#777777`
- Accent gradient: `linear-gradient(#F743B6, #FCC043)` (pink → gold) — pulled from the border of the old site at www.jpmarra.com
- The gradient is used for: hero name text fill, timeline dots, social icon hover glow, email hover underline

### Typography
- **Font:** Recursive (Google Fonts, variable font)
- **Axes used:** `MONO 1` (monospace), `CASL 0.5` on hero name for personality, `CASL 0` elsewhere
- **Weight range:** 300–900
- Monospace everywhere. The user said "monotyped" meaning monospace.
- Hero name: 900 weight, huge display size
- Subtitle: 300 weight, uppercase, wide letter-spacing

### Tech Stack
- Plain HTML + CSS + vanilla JS. No framework, no build step.
- Recursive font from Google Fonts CDN
- SVG social icons (twitter, linkedin, github, email) copied from old Gatsby site with `fill="#eeeeee"`
- Local dev: `python3 -m http.server` on any port (was using 3457)

## Site Structure (3 Sections)

### 1. Hero (100vh, centered)
- "JP Marra" — giant gradient text (`-webkit-background-clip: text`)
- "Engineering Leader" — muted, uppercase, letter-spaced
- 4 social icon links in circles: Twitter, LinkedIn, GitHub, Email (mailto:hello@jpmarra.com)
- Staggered fadeUp animation on page load (name → title → icons, 0.1s/0.3s/0.5s delays)

### 2. Experience (the showcase — takes up lots of space)
- Short leadership summary paragraph centered at top
- **5 experiences** in a vertical zigzag timeline alternating left/right
- Left entries: content on left, dot on right side of content (dot at center line)
- Right entries: content on right, dot on left side of content (dot at center line)
- The dotted zigzag SVG line is drawn by JavaScript — connects dot centers with right-angle segments (down, across, down pattern)
- **Dots:** 20px gradient circles, hover → scale(1.4) + gradient glow box-shadow
- **Company names:** HUGE (up to 3rem, weight 800) — this is the centerpiece
- **Roles:** 1.4rem, color #aaa
- **Dates:** 1.1rem, muted, letter-spaced
- Entries are 50% width with 32px inner padding, 28px gap between dot and content, 96px gap between entries
- max-width: 1200px — spans wide

### 3. Contact (short, centered)
- "Get in Touch" heading
- `mailto:hello@jpmarra.com` link — muted, gets gradient underline on hover

## Timeline Zigzag (JS-drawn SVG)
The zigzag is drawn by `js/main.js`:
- Finds all `.timeline-dot` elements
- Calculates their center positions relative to `.timeline` container
- Draws an SVG `<path>` connecting them with right-angle segments:
  - From dot 1, go straight down to midpoint Y between dot 1 and dot 2
  - Go horizontally to dot 2's X position
  - Go straight down to dot 2
  - Repeat for each pair
- Path style: `stroke: #444`, `stroke-width: 2`, `stroke-dasharray: 6 4` (dotted)
- Redraws on window resize
- Hidden on mobile (≤768px) — replaced by a straight vertical dotted line on the left

## Mobile (≤768px)
- All timeline entries collapse to left-aligned, single column
- Straight vertical dotted line on the left side
- SVG zigzag hidden
- Tighter spacing (36px gap, 20px left padding)
- Social icons slightly smaller on ≤480px

## Visual Polish Applied
- Subtle SVG noise texture on body::before at 3% opacity for depth
- Social icons: borders start `#333`, glow pink on hover, images 60% → 100% opacity
- `cubic-bezier(0.16, 1, 0.3, 1)` easing on animations for snappy feel
- Contact email: gradient-colored bottom border on hover

## File Structure
```
jp-personal-site/
├── index.html          # Single page, all 3 sections
├── css/styles.css      # All styles
├── js/main.js          # SVG zigzag drawing + resize handler
├── assets/
│   ├── twitter.svg
│   ├── linkedin.svg
│   ├── github.svg
│   └── email.svg
├── CNAME               # jpmarra.com (GitHub Pages)
├── CLAUDE.md           # Project instructions for Claude
└── PROJECT_CONTEXT.md  # This file
```

## Current State / What's Left
- ✅ Hero section — working, animated, gradient text
- ✅ Experience section — 5 entries, zigzag SVG line, large dramatic typography
- ✅ Contact section — working
- ✅ Mobile responsive layout
- ⚠️ Timeline zigzag SVG line — needs visual verification in browser (install Playwright MCP to check)
- ⚠️ Experience content is placeholder — user will fill in real company names/dates/titles later
- ⚠️ Leadership summary is placeholder text
- ⚠️ Social links point to placeholder URLs (twitter.com/jpmarra etc) — may need updating
- 🔲 Git: repo initialized but no commits yet
- 🔲 GitHub Pages deployment not set up yet
- 🔲 No favicon yet

## User Preferences
- Wants dark, minimal, modern aesthetic inspired by Vercel/Next.js sites
- Wants the experience timeline to be the **dramatic showcase** of the site — big, bold, page-filling
- Likes the gradient from old site and wants it as the primary accent
- Does NOT like fade-in scroll animations — prefers subtle hover interactions
- Wants responsive mobile experience
- Use `/frontend-design` skill (frontend-design:frontend-design) when building UI
- Use Playwright MCP for browser verification
- Familiar with React/Next.js but chose static HTML/CSS for simplicity and free hosting

## Old Site Reference
Located at `/Users/jmarra/Projects/personal/personal-site/` — Gatsby v2, styled-components, Geogrotesque font, framer-motion. The gradient `linear-gradient(#F743B6, #FCC043)` was used as a border around the viewport.
