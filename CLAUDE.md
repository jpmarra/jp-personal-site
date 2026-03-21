# JP Personal Site

Static personal site for jpmarra.com. Single-page, no framework, no build step.

## Stack
- Plain HTML + CSS + vanilla JS
- Google Fonts: Recursive (variable font — axes: MONO, CASL, wght)
- Hosted on GitHub Pages with custom domain (CNAME: jpmarra.com)

## Development
Run locally: `python3 -m http.server 8765` or `npx serve`

## File Structure
```
index.html          — Single page: hero, experience timeline, contact
css/styles.css      — All styling (variables, layout, responsive, animations)
js/main.js          — Zigzag SVG line, hero scramble, text breathing, star diffraction
assets/             — SVG social icons (twitter, linkedin, github, email)
CNAME               — GitHub Pages custom domain
PROJECT_CONTEXT.md  — Full project history and design decisions
```

## Design System

### Colors (CSS variables in :root)
- `--bg: #121212` — background
- `--bg-elevated: #1a1a1a` — elevated surfaces
- `--text: #eeeeee` — primary text
- `--text-muted: #777777` — muted text (dates, subtitles)
- `--text-secondary: #999999` — secondary text (roles)
- `--border: #333333` — borders, dividers
- `--gradient-start: #F743B6` — pink (gradient start)
- `--gradient-end: #FCC043` — gold (gradient end)

### Typography
- Font: Recursive from Google Fonts CDN
- Base: `'MONO' 1, 'CASL' 0` (full monospace, no casual)
- Hero name: weight 900, `CASL 0` at rest — breathing effect shifts CASL/MONO/weight on hover
- Company names: weight 800, uppercase
- Subtitle/labels: weight 300-500, uppercase, letter-spaced
- Use `clamp()` for all font sizes — no hard breakpoints for typography

### Accent Gradient
The pink→gold gradient is the primary accent. Used for:
- Hero name text fill (animated shifting gradient with white highlight)
- Timeline dots (gradient circles)
- Company name hover (gradient text)
- Contact email hover (gradient text + underline)
- Section dividers (fade-in/fade-out gradient line)
- Social icon hover glow
- Timeline role border accent on hover

## Page Sections

### 1. Hero
- `padding: 14vh 2rem 8vh` (NOT 100vh — content-driven height)
- "JP Marra" — character-by-character scramble reveal on load, animated gradient, proximity-based variable font breathing on hover
- "— Engineering Leader —" — flanking em dashes, muted uppercase
- Social icon links in circles (Twitter, LinkedIn, GitHub, Email)
- Staggered fadeUp: name chars → subtitle (0.9s) → icons (1.1s)

### 2. Experience Timeline
- Summary paragraph: max-width 800px, centered
- 5 entries in zigzag layout, alternating left/right
- `<ul>` with `<li>` elements for semantic markup
- Entries are 60% width, gap 140px
- Dots: 20px gradient circles on the outer edge of each entry
- First dot (Spotify/current): star diffraction effect with 8 animated spikes
- JS-drawn SVG zigzag line connects dots with right-angle segments
- Line has marching ants animation (dots flowing along path)
- Horizontal segment Y position: content center for middle entries, dot center for first/last
- Company + date inline in a header row, role below with gradient border-left accent
- Hover: dot glows, company name gets gradient, content shifts 6px toward center, role border gets gradient

### 3. Contact
- "Let's build something" — small muted uppercase label
- "jp.marra@me.com" — large bold text, gradient + underline on hover

## Design Elements

### Vertical Marquees
- Fixed position, left and right edges of viewport
- "JP MARRA" and "ENGINEERING LEADER" alternating, vertical text
- 80px wide, 1.3rem, 25% opacity, weight 300
- Left scrolls down, right scrolls up (40s loop)
- Two duplicate tracks for seamless looping
- Hidden on mobile (≤768px)

### Section Dividers
- `<hr>` with gradient background: transparent → pink → gold → transparent
- 60% max-width, centered, 40% opacity

### Noise Texture
- SVG noise on `body::before`, fixed position, 3% opacity, pointer-events none

### Cursor
- Crosshair globally

## Responsive Breakpoints
- **≤1024px (tablet)**: Tighter timeline gap (64px), smaller company text
- **≤768px (mobile)**: Single-column timeline, straight vertical dotted line replaces SVG zigzag, marquees hidden, timeline header stacks vertically, hover shifts disabled
- **≤480px**: Tighter social icon spacing

## Accessibility
- `prefers-reduced-motion`: All animations disabled, opacity set to 1, transitions removed
- `<main>` landmark wraps all content
- Timeline uses `<ul>`/`<li>` semantic markup
- Marquees have `aria-hidden="true"`
- Social links have `aria-label`
- `<meta name="color-scheme" content="dark">` prevents FOUC
- Hero `<h1>` has fallback text content (JS enhances it)

## JS Architecture (main.js)
- `debounce(fn, ms)` — utility for resize handler
- `drawTimelinePath()` — calculates dot positions, draws SVG zigzag, triggers marching ants animation
- `animatePathDraw(path)` — marching ants via Web Animations API
- `createStarDiffraction()` — 8 light spikes on first timeline dot
- `initHeroName()` — splits h1 into char spans, scramble reveal effect
- `initBreathe(container, opts)` — reusable proximity-based variable font interaction (mousemove with RAF batching)
- `initHeroBreathe()` — applies breathing to hero name
- All init functions called on DOMContentLoaded
- Resize redraws timeline path (debounced 150ms)

## Important Conventions
- No frameworks, no build tools, no npm — keep it static
- All colors via CSS custom properties
- All font sizes via `clamp()` — responsive without media queries
- Animations respect `prefers-reduced-motion`
- SVG zigzag is drawn by JS, not hardcoded — redraws on resize
- The gradient (pink→gold) is from the old site — maintain it as the primary accent
- User does NOT want scroll-triggered fade-in animations — hover interactions only
- Crosshair cursor everywhere
