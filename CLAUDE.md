# SocioFi Technology — Design System & Development Guidelines (v2)

> **This is the single source of truth for the SocioFi website.**
> Read this ENTIRE file before writing any code. Every design token, component pattern,
> content guideline, division config, and architectural decision is here.
>
> **Stack:** Next.js 14+ (App Router) • TypeScript • Tailwind CSS • Framer Motion • Sanity CMS • Anthropic SDK
> **Scale:** 91 pages • 7 divisions + parent • Light + Dark themes • PILOT AI assistant

---

## Company Identity

SocioFi Technology is an **AI-agent-native software development company**. We operate a hybrid model: AI agents handle the heavy lifting of development, automation, and maintenance — while expert human engineers architect, review, debug, and keep everything running.

**Brand Essence:** "Intelligent Systems. Autonomous Results."
**Tagline (internal):** "AI Builds. Humans Architect. You Scale."

**Positioning:** SocioFi exists for a specific person: someone who *knows* AI can build software — they've seen what tools like AI coding platforms can do — but they **don't have a technical team** to handle architecture, debugging, deployment, security, maintenance, and everything else that turns a prototype into a real product.

**Founded by:** Arifur Rahman (CEO) and Kamrul Hasan (CTO), both BUET graduates, based in Dhaka, Bangladesh.

### Who We're Talking To

1. **Solo Founders & Entrepreneurs** — Building their first product. Prototyped with AI coding tools but hit walls: can't deploy, can't debug, don't know DevOps.
2. **Small & Medium Businesses (SMEs)** — Working business, no dev team. Need internal tools, automation, customer-facing apps.
3. **Non-Technical Teams at Larger Companies** — Innovation leads, ops managers with budget and vision but no engineering resources.

### Core Insight

These people are NOT intimidated by AI — they're excited about it. What they lack is:
- The technical depth to go from "AI-generated code" to "production-ready product"
- Someone to debug when things break at 2am
- A team to handle deployment, hosting, security, updates
- Confidence that the thing they built won't fall apart in 6 months

**SocioFi is that team.**

---

## Design Philosophy

### Aesthetic Direction: Silicon Valley Premium

Our website should feel like it belongs alongside **Linear, Vercel, Stripe, Raycast, and Resend** — not like a generic SaaS template or WordPress theme.

**Key principles:**

1. **Generous whitespace** — Sections breathe. Nothing feels cramped. Let content exist in space.
2. **Subtle depth** — Noise textures (2-3% opacity), gradient meshes, layered transparencies. Never flat.
3. **Typography-first** — Headlines do the heavy lifting. Syne 800 with tight tracking commands attention.
4. **Purposeful motion** — Every animation earns its place. Scroll reveals, hover responses, page transitions. 60fps always.
5. **Glassmorphism done right** — Frosted glass nav, glassmorphic panels for featured content. Subtle, not overdone.
6. **Gradient restraint** — Our navy→teal gradient is the signature. Use it for emphasis, not decoration.
7. **Dark-first, light-polished** — Dark mode is the DEFAULT. Light mode is equally considered, uses blue-tinted whites (#FAFBFE), not pure white.
8. **Division identity** — Each division feels like its own brand within the family. Same skeleton, different accent DNA.

### What we ARE NOT:
- Generic SaaS template with stock photos and purple gradients
- "AI company" site with robot imagery and circuit board graphics
- Enterprise portal with dense navigation and corporate language
- Single-page parallax showcase with no real content depth

### What we ARE:
- A 91-page product-quality site that feels handcrafted
- Technically sophisticated but accessible to non-technical visitors
- Confident without being cocky, warm without being casual
- A site where every pixel and every word is intentional

---

## CRITICAL RULES

1. **NEVER mention "Claude", "Anthropic", "OpenAI", "GPT", "Gemini" or any specific LLM provider on public-facing pages.** Use "advanced AI models", "AI coding platforms", "AI development tools", or "modern AI" instead. We are model-agnostic in our public positioning.
2. **NEVER use emojis anywhere on the website.** All icons must be inline SVGs following the icon system below.
3. **NEVER use generic stock photography.** Use abstract tech visuals, custom illustrations, or the graphic motif system.
4. **NEVER write like a typical enterprise SaaS site.** No corporate jargon. Our audience is smart but non-technical. Write like you're explaining to a sharp founder over coffee — direct, clear, no condescension.
5. **SUPPORT BOTH dark and light themes.** Dark is the DEFAULT. Light theme uses blue-tinted whites (#FAFBFE), not pure white. Use CSS custom properties for ALL colors so theme switching works via `[data-theme]` attribute. Think Linear.app — premium in both modes.
6. **ALWAYS use the exact CSS variables, fonts, and spacing defined below.** No deviations.
7. **ALWAYS lead with the pain point, then the solution.** Our audience feels their problem acutely — acknowledge it before pitching.
8. **ALWAYS make pricing and process feel accessible.** No "contact sales" energy. Show clear paths, packages, and timelines.

---

## Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 14+ (App Router) | SSG for most pages, server components for blog |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS + CSS Variables | Design tokens from this file map to tailwind.config.ts |
| Animation | Framer Motion | Scroll reveals, page transitions, micro-interactions |
| Theming | next-themes | Dark/light toggle, system preference detection |
| CMS | Sanity | Content editing at /admin, ISR revalidation |
| Forms | Formspree or Next.js API routes | No backend server needed |
| AI Agent | Anthropic SDK (PILOT) | FastAPI backend or Next.js API route |
| Icons | Inline SVGs | From icon library below. No icon fonts. |
| Fonts | next/font | Syne, Outfit, Fira Code — loaded locally |
| Deployment | Vercel | Global CDN, automatic SSL |
| Analytics | Plausible or Umami | Privacy-friendly |

---

## Design Tokens

### CSS Custom Properties — Dual Theme

```css
:root {
  /* ── Primary Colors (shared) ── */
  --navy: #3A589E;
  --navy-deep: #2C4478;
  --navy-bright: #4A6CB8;
  --teal: #59A392;
  --teal-light: #72C4B2;
  --teal-pale: #A3DFD2;

  /* ── Division Accent Colors ── */
  --color-studio: #72C4B2;
  --color-services: #4DBFA8;
  --color-labs: #7B6FE8;
  --color-products: #E8916F;
  --color-academy: #E8B84D;
  --color-ventures: #6BA3E8;
  --color-cloud: #5BB5E0;

  /* ── Typography ── */
  --font-display: 'Syne', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* ── Motion ── */
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);

  /* ── Spacing ── */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 80px;
  --space-section: 120px;

  /* ── Radius ── */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-full: 100px;

  /* ── Gradients (shared) ── */
  --gradient-brand: linear-gradient(135deg, var(--navy) 0%, var(--teal) 100%);
  --gradient-brand-h: linear-gradient(90deg, var(--navy) 0%, var(--teal) 100%);
}

/* ══════════════════════════════════════
   DARK THEME (default)
   ══════════════════════════════════════ */
[data-theme="dark"] {
  --bg: #0C0C1D;
  --bg-2: #111128;
  --bg-3: #161636;
  --bg-card: #13132B;
  --bg-card-hover: #181840;
  --text-primary: #FFFFFF;
  --text-secondary: #7C8DB0;
  --text-muted: #4A5578;
  --border: rgba(89,163,146,0.08);
  --border-hover: rgba(89,163,146,0.15);
  --card-shadow: none;
  --card-hover-shadow: 0 20px 60px rgba(0,0,0,0.25);
  --nav-bg: rgba(12,12,29,0.8);
  --nav-border: rgba(89,163,146,0.06);
  --glow-opacity: 0.08;
  --grid-color: rgba(89,163,146,0.035);
  --noise-opacity: 0.03;
  --gradient-text-fallback: #72C4B2;
  --code-bg: #0C0C1D;
  --code-border: rgba(89,163,146,0.1);
  --glass-bg: rgba(17,17,40,0.6);
  --glass-border: rgba(89,163,146,0.1);
}

/* ══════════════════════════════════════
   LIGHT THEME
   ══════════════════════════════════════ */
[data-theme="light"] {
  --bg: #FAFBFE;
  --bg-2: #F1F4F9;
  --bg-3: #E8ECF4;
  --bg-card: #FFFFFF;
  --bg-card-hover: #FFFFFF;
  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --border: rgba(58,88,158,0.08);
  --border-hover: rgba(58,88,158,0.15);
  --card-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04);
  --card-hover-shadow: 0 4px 12px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.06);
  --nav-bg: rgba(250,251,254,0.85);
  --nav-border: rgba(58,88,158,0.06);
  --glow-opacity: 0.04;
  --grid-color: rgba(58,88,158,0.04);
  --noise-opacity: 0.015;
  --gradient-text-fallback: #2C4478;
  --code-bg: #F1F4F9;
  --code-border: rgba(58,88,158,0.1);
  --glass-bg: rgba(255,255,255,0.7);
  --glass-border: rgba(58,88,158,0.08);
}
```

### Tailwind Config Extension

```typescript
// tailwind.config.ts — key extensions
colors: {
  navy: { DEFAULT: "#3A589E", deep: "#2C4478", bright: "#4A6CB8" },
  teal: { DEFAULT: "#59A392", light: "#72C4B2", pale: "#A3DFD2" },
  studio: "#72C4B2",
  services: "#4DBFA8",
  labs: "#7B6FE8",
  products: "#E8916F",
  academy: "#E8B84D",
  ventures: "#6BA3E8",
  cloud: "#5BB5E0",
},
fontFamily: {
  display: ["var(--font-syne)", "sans-serif"],
  body: ["var(--font-outfit)", "sans-serif"],
  mono: ["var(--font-fira)", "monospace"],
},
```

---

## Typography Rules

| Element | Font | Size | Weight | Line Height | Color | Letter Spacing |
|---------|------|------|--------|-------------|-------|----------------|
| Display / Hero H1 | Syne | clamp(2.6rem, 5vw, 4rem) | 800 | 1.06 | --text-primary | -0.035em |
| Page Title H1 | Syne | clamp(2rem, 3.5vw, 2.8rem) | 700 | 1.12 | --text-primary | -0.025em |
| Section Title H2 | Syne | clamp(1.8rem, 3vw, 2.4rem) | 700 | 1.15 | --text-primary | -0.02em |
| Subsection H3 | Syne | 1.2rem | 600 | 1.3 | --text-primary | -0.01em |
| Card Title | Syne | 1.1rem | 600 | 1.25 | --text-primary | -0.01em |
| Body Large | Outfit | 1.1rem | 400 | 1.75 | --text-secondary | normal |
| Body Default | Outfit | 0.95rem | 400 | 1.65 | --text-secondary | normal |
| Body Small | Outfit | 0.84rem | 400 | 1.6 | --text-muted | normal |
| Section Label | Fira Code | 0.72rem | 500 | 1.4 | var(--division-accent) | 0.12em |
| Badge / Tag | Fira Code | 0.7rem | 500 | 1.3 | var(--division-accent) | 0.06em |
| Button Text | Syne | 0.9rem | 600 | 1 | --text-primary | -0.01em |
| Nav Link | Outfit | 0.85rem | 500 | 1 | --text-secondary | 0.02em |
| Code Block | Fira Code | 0.82rem | 400 | 1.8 | --text-primary | normal |
| Footer Link | Outfit | 0.84rem | 400 | 1 | --text-muted | normal |

### Typography Rules
- **DO** use `clamp()` for responsive heading sizes
- **DO** use negative letter-spacing on Syne headings
- **DO** use sentence case for headings (not Title Case, not ALL CAPS except labels)
- **DON'T** use Syne below 1rem — switch to Outfit for small text
- **DON'T** use Outfit for headings
- **DON'T** use any other fonts (no Inter, no Space Grotesk, no Arial)

---

## Division Color System

Every division page injects `--division-accent` via its layout. This drives CTA buttons, gradient text, icon tints, card hover borders, section labels, and hero gradients.

| Division | Slug | Accent | Light Variant | Logo Modifier | CTA |
|----------|------|--------|---------------|---------------|-----|
| Technology (Parent) | technology | #4A6CB8 | #6B8CD4 | none (pure chevrons) | — |
| Studio | studio | #72C4B2 | #A3DFD2 | corner brackets | "Start a Project" |
| Services | services | #4DBFA8 | #7DD4C0 | signal arcs | "Get Protected" |
| Labs | labs | #7B6FE8 | #A59BF0 | particle dots | — |
| Products | products | #E8916F | #F0B49A | stacked diamonds | "View Products" |
| Academy | academy | #E8B84D | #F0D080 | open book + rays | "Browse Courses" |
| Ventures | ventures | #6BA3E8 | #9BC0F0 | ascending branch | "Apply" |
| Cloud | cloud | #5BB5E0 | #8CD0F0 | stacked lines + arrow | "Get Hosted" |

### Division Layout Pattern
```tsx
// src/app/(studio)/layout.tsx
export default function StudioLayout({ children }) {
  return (
    <div style={{ '--division-accent': '#72C4B2' } as React.CSSProperties}>
      <Nav division={divisions.studio} />
      {children}
      <Footer division={divisions.studio} />
      <PILOTChat division={divisions.studio} />
    </div>
  );
}
```

---

## Component Patterns (Theme-Aware)

ALL components MUST work in both themes. Use CSS variables, never hardcoded colors.

### Section Label
```html
<div class="sec-label">Section Label Text</div>
```
```css
.sec-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--division-accent, var(--teal));
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.sec-label::before {
  content: '';
  width: 20px;
  height: 1.5px;
  background: var(--division-accent, var(--teal));
  display: inline-block;
}
```

### Buttons
```css
.btn-primary {
  background: var(--gradient-brand);
  color: white;
  box-shadow: 0 4px 24px rgba(58,88,158,0.35);
}
.btn-primary:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 10px 40px rgba(58,88,158,0.5);
}

.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1.5px solid var(--border);
}
.btn-ghost:hover {
  border-color: var(--division-accent, var(--teal));
  color: var(--division-accent, var(--teal-light));
}

.btn-accent {
  background: var(--division-accent);
  color: white;
}
```

### Cards
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--card-shadow);
  transition: all 0.4s var(--ease);
}
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--navy), var(--division-accent, var(--teal)));
  opacity: 0;
  transition: opacity 0.4s;
}
.card:hover {
  border-color: var(--border-hover);
  transform: translateY(-6px);
  box-shadow: var(--card-hover-shadow);
}
.card:hover::before { opacity: 1; }
```

### Glass Panel
```css
.glass-panel {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
}
```

### Navigation
```css
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 20px 0;
  transition: all 0.5s var(--ease);
}
.nav.scrolled {
  padding: 10px 0;
  background: var(--nav-bg);
  backdrop-filter: blur(24px) saturate(1.5);
  border-bottom: 1px solid var(--nav-border);
}
```

### Gradient Text
```css
.gradient-text {
  background: linear-gradient(135deg, var(--navy-bright) 0%, var(--division-accent, var(--teal)) 50%, var(--teal-pale) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
@media (forced-colors: active) {
  .gradient-text { -webkit-text-fill-color: unset; }
}
```

---

## Layout System

- **Max width:** 1200px centered (1280px for some hero sections)
- **Page padding:** 32px sides (20px on mobile)
- **Section padding:** 120px vertical (80px on mobile)
- **Grid gap:** 20-28px for card grids, 60-80px for content + visual splits
- **Card padding:** 28-36px

### Breakpoints
```css
/* Desktop-first responsive */
@media (max-width: 1280px) { /* Large desktop adjustments */ }
@media (max-width: 1024px) { /* Tablet: 2-col → 1 or 2 cols, section padding → 100px */ }
@media (max-width: 768px)  { /* Mobile: all grids → 1 col, padding → 80px/20px */ }
@media (max-width: 480px)  { /* Small mobile: hero title → 2.1rem, stack buttons */ }
```

### Page Structure
Every page follows:
```
[Fixed Navigation — glassmorphic on scroll]
[Page Hero — unique per page, background effects]
[Content Sections — alternating var(--bg) / var(--bg-2)]
[Social Proof — testimonials or logos where applicable]
[CTA Section — gradient glow background]
[PILOT Chat — floating button, bottom-right]
[Footer — var(--bg-2)]
```

---

## Animation System

### Timing Functions
- `--ease`: cubic-bezier(0.16, 1, 0.3, 1) — smooth deceleration, primary
- `--ease-spring`: cubic-bezier(0.34, 1.56, 0.64, 1) — slight overshoot, playful
- `--ease-out`: cubic-bezier(0, 0, 0.2, 1) — fast start, exits

### Scroll Reveal (framer-motion)
- Threshold: 0.15 viewport visibility
- Default: opacity 0→1, translateY(30px)→0, duration 0.7s, ease `--ease`
- Stagger children: 0.1s increments
- Respect `prefers-reduced-motion`: skip all non-essential animation

### Hover Micro-Interactions (60fps)
- Cards: translateY(-6px) + shadow expansion + gradient border reveal, 0.4s
- Buttons: scale(1.03) + shadow glow, 0.2s
- Nav links: gradient underline slide-in from left, 0.3s
- Division cards: magnetic tilt effect (cursor-following, max 4deg)
- Icons: scale(1.1) + subtle rotation, 0.2s

### Background Effects
- **Gradient orbs:** absolute positioned, 500-800px, filter:blur(100px), low opacity, gentle floating animation
- **Animated grid:** linear-gradient grid at 80px, mask-image radial fade, translateY drift (20s linear infinite)
- **Noise texture:** SVG noise overlay, 2-3% opacity (var(--noise-opacity))

### Performance Rules
- ONLY animate `transform` and `opacity` (composited properties)
- Use `will-change` sparingly, only during active animation
- Lazy load animation-heavy components (ParticleField, canvas effects)
- Target 60fps — test with Chrome DevTools Performance tab

---

## Icon System

**ALL icons are inline SVGs. No emojis. No icon fonts. No PNGs.**

| Size | Dimensions | Stroke Width | Use Case |
|------|------------|--------------|----------|
| sm | 16-20px | 1.5px | Inline, nav |
| md | 24px | 1.8px | Lists, features |
| lg | 28-36px | 1.8px | Cards, process steps |
| xl | 48px | 2px | Hero elements |

**Style:** Stroke-based (outlined), never filled. `stroke-linecap="round"` and `stroke-linejoin="round"` always. Colors use CSS variables.

### Core Icons (keep these SVGs in src/lib/icons.tsx):
Arrow Right, Chevron Down/Right, Terminal, Code, Gear, Shield, Wrench, Rocket, Chart, Users, Lightning, Building, Globe, Lock, Database, Cloud, Brain, Book, Briefcase, ExternalLink, Menu, X, Sun, Moon, Search, Mail, Phone, Calendar, Check, Star, Quote, Play, Layers, GitBranch, Zap, Target, Heart, Eye, Download, Share, Filter, Grid, List

---

## 7 Division Architecture (91 Pages)

| Division | Pages | URL Prefix | Nav Context |
|----------|-------|------------|-------------|
| Parent (Technology) | 8 | / | All 7 divisions as links |
| Studio | 28 | /studio | Services, Solutions, Work, Process, Pricing |
| Services | 10 | /services | Monitoring, Security, Bug Fixes, Features, Performance, Plans |
| Labs | 8 | /labs | Research, Projects, Open Source, Blog |
| Products | 10 | /products | FabricxAI, NEXUS ARIA, DevBridge |
| Academy | 12 | /academy | Courses, Workshops, Corporate, Certification, Free |
| Ventures | 8 | /ventures | How It Works, Portfolio, Apply |
| Cloud | 8 | /cloud | Why Managed, Features, Security, Providers, Plans |

### 12 Template System
One template, many pages. Change the template → all pages using it update instantly.

| Template | Used By | Key Sections |
|----------|---------|-------------|
| DivisionOverview | 7 division homepages | Hero + metrics + card grid + differentiators + CTA |
| ServiceDetail | 20+ service pages | Hero + problem + capabilities + process + case study + CTA |
| DeepDive | 12+ sub-pages | Focused hero + use cases + deliverable mockup + timeline + FAQ |
| AudienceLanding | 5 audience pages | Pain points + timeline + what you get + testimonials + FAQ |
| PricingPlans | 3 pricing pages | Tier cards + comparison table + bundles + FAQ |
| ConversionForm | 6+ forms | 2-col: form (60%) + trust sidebar (40% sticky) |
| GridListing | 5+ listings | Filter bar + card grid + pagination |
| DetailPage | Dynamic slugs | Header + narrative + metrics + related + CTA |
| BlogListing | 2 blog hubs | Featured hero + filterable grid + newsletter |
| BlogPost | Dynamic slugs | Article header + MDX content + related posts |
| StoryPage | 3 about pages | Narrative sections + values + team + CTA |
| HubRouter | 3 hub pages | Division/category cards as primary navigation |

---

## Content Management (Sanity CMS)

Moderators edit content at `/admin` (Sanity Studio). The site rebuilds via ISR (60s revalidation) or instant webhook.

### What Moderators Edit:
- Blog posts (full rich text articles)
- Portfolio/case study projects
- Testimonials
- FAQ items (per division)
- Team members
- Course catalog + workshop schedule
- Pricing plans (prices, features, badges)
- CTA section copy
- Division hero text and descriptions

### What Stays in Code (NOT CMS):
- Layout/template structure
- Navigation component logic
- CSS/design tokens + theme system
- Animation system
- PILOT agent behavior
- SEO/meta generation logic

---

## PILOT AI Assistant

PILOT (Proactive Intelligent Liaison for Orientation & Touchpoints) is SocioFi's website AI assistant. NOT a chatbot — a knowledgeable guide.

### Component: PILOTChat.tsx
Present on every page as a floating button + expandable chat panel.

**Floating Button:**
- 56px circle (48px mobile), bottom-right, 24px from edges
- Background: division accent color (changes per division)
- Icon: SocioFi double-chevron in white
- Gentle pulse on load, stops after 3s

**Chat Panel:**
- 380px × 520px desktop, full-width 70vh mobile (bottom sheet)
- Background: var(--bg-card), gradient border
- Header: accent bar + "PILOT" in Fira Code + chevron icon
- Quick action buttons below each response (2-4 pills)

**Division-Specific Behavior:**
- Parent (/): "What are you trying to do?" → division routing
- Studio: "What are you building?" → project estimation
- Services: "What software do you have?" → plan recommendation
- Academy: "What do you want to learn?" → course recommendation
- Ventures: "Tell me about your startup" → self-qualification
- Cloud: "What does your app run on?" → hosting assessment

**Proactive Triggers:**
- Homepage first visit: 8s → "Hey! I'm PILOT..."
- Pricing pages: 15s → "Questions about pricing?"
- 60s no interaction → "Still looking?"
- Exit intent (desktop) → "Before you go..."
- Max 3 proactive messages per session

**Backend:** Anthropic SDK + pgvector RAG over all 91 pages. 8 tools: get_pricing, recommend_plan, estimate_project, check_feasibility, route_to_division, capture_lead, book_call, get_faq.

**System Prompt Identity:**
"I'm PILOT, SocioFi's AI assistant. I know every division, every service, every price point. For anything I can't handle, I'll connect you with a real person."

---

## Content Guidelines

### Writing for Our Audience
- **Lead with their pain point.** Acknowledge the frustration before offering the solution.
- **Acknowledge what they already know.** Don't explain what AI coding is — they've used it.
- **Be specific about division of labor.** What AI does vs what humans do vs what they do.
- **Use relatable numbers.** "2-3 weeks" not "10x velocity."
- **Sound like a trusted partner, not a vendor.** Sharp technical co-founder energy.
- **Never condescend.** They're non-technical, not stupid. Big difference.

### Voice & Tone
| Quality | How it sounds |
|---------|--------------|
| Confident but not cocky | "We've done this dozens of times" |
| Clear but not dumbed down | "We handle the deployment pipeline" |
| Warm but professional | "Let's figure this out together" |
| Direct but empathetic | "Most AI prototypes break in production. That's normal." |
| Honest about limitations | "AI writes great code — but it needs humans to debug and maintain it" |

### Banned Words
Claude, Anthropic, OpenAI, GPT, Gemini, enterprise (unless addressing enterprises), leverage, synergy, paradigm, disrupt, game-changer, simple, easy, just, users (say "your customers"), resources (when referring to people)

### Word Substitutions
| Instead of... | We say... |
|--------------|-----------|
| Enterprise solution | Your product / your app |
| Deploy to production | Launch / go live / ship it |
| Technical debt | Code that breaks over time |
| CI/CD pipeline | Automatic updates and testing |
| SLA | Guaranteed uptime |
| Sprint | Build cycle |
| Discovery call | Free consultation / intro call |

---

## SEO & Meta

Every page MUST include:
```html
<title>{Page Title} — SocioFi Technology</title>
<meta name="description" content="{150-160 chars}" />
<meta property="og:title" content="{Page Title} — SocioFi Technology" />
<meta property="og:description" content="{Description}" />
<meta property="og:type" content="website" />
<meta property="og:image" content="/og-image.png" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Add JSON-LD structured data: Organization, WebSite, BreadcrumbList.
Generate sitemap.xml and robots.txt automatically.

---

## Accessibility (WCAG AA)

- All interactive elements keyboard-navigable
- Focus states: visible teal outline (2px, offset 2px)
- Color contrast: 4.5:1 body, 3:1 large text — verified in BOTH themes
- Skip-to-content link
- One h1 per page, proper heading hierarchy
- SVG icons: `aria-hidden="true"` if decorative, `aria-label` if functional
- Form inputs: associated `<label>` elements
- Alt text on all images
- Reduced motion: `prefers-reduced-motion` respected
- Screen reader announcements for dynamic content (PILOT messages)

---

## File Organization

```
src/
├── app/
│   ├── layout.tsx                       ← Root: fonts, theme provider, globals
│   ├── page.tsx                         ← Homepage
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── careers/page.tsx
│   ├── legal/page.tsx
│   ├── partnerships/page.tsx
│   ├── admin/[[...index]]/page.tsx      ← Sanity Studio
│   ├── (studio)/layout.tsx              ← Studio nav + accent
│   │   └── studio/[...slug]/page.tsx
│   ├── (services)/layout.tsx
│   │   └── services/[...slug]/page.tsx
│   ├── (labs)/layout.tsx
│   │   └── labs/[...slug]/page.tsx
│   ├── (products)/layout.tsx
│   │   └── products/[...slug]/page.tsx
│   ├── (academy)/layout.tsx
│   │   └── academy/[...slug]/page.tsx
│   ├── (ventures)/layout.tsx
│   │   └── ventures/[...slug]/page.tsx
│   └── (cloud)/layout.tsx
│       └── cloud/[...slug]/page.tsx
├── components/
│   ├── shared/      ← Nav, Footer, ThemeToggle, Logo, Button, SectionHeader,
│   │                   CTASection, ScrollReveal, Container, PILOTChat, PILOTAvatar
│   ├── cards/       ← Card, ServiceCard, PricingCard, TestimonialCard, PortfolioCard,
│   │                   CourseCard, TeamCard
│   ├── sections/    ← Hero, PainPoints, ProcessTimeline, ComparisonTable, FAQAccordion,
│   │                   TrustBar, MetricBar, DivisionGrid, LogoMarquee
│   ├── visual/      ← AnimatedGrid, GradientOrbs, GlassPanel, FloatingCard,
│   │                   ParticleField, ChevronMark, GridPattern
│   └── forms/       ← ContactForm, ProjectForm, ApplicationForm
├── templates/       ← 12 page templates (DivisionOverview, ServiceDetail, etc.)
├── lib/
│   ├── divisions.ts ← All 7 division configs
│   ├── icons.tsx    ← All SVG icons as React components
│   ├── utils.ts     ← cn(), clsx helpers
│   └── content/     ← Page content data (or fetched from Sanity)
├── sanity/
│   ├── schemas/     ← All Sanity document + object schemas
│   ├── client.ts    ← Sanity client config
│   └── queries.ts   ← GROQ queries
├── styles/
│   ├── globals.css  ← CSS variables, reset, base styles
│   └── animations.css
└── public/
    ├── fonts/
    ├── og-image.png
    └── favicon.svg
```

---

## Quick Reference

### Build Order (MVP → Full)
1. Phase 0: Project setup, Tailwind, globals, theme system
2. Phase 1: Shared components (Nav, Footer, Cards, Hero, ScrollReveal, templates)
3. Phase 2: Parent brand pages (8)
4. Phase 3: Studio (28 pages — the revenue engine)
5. Phase 4: Services (10) + Labs (8) + Products (10)
6. Phase 5: Academy (12) + Ventures (8) + Cloud (8)
7. Phase 6: Animation polish, SEO, performance, accessibility
8. Phase 7: Sanity CMS integration
9. Phase 8: PILOT AI agent

### Minimum Viable Site (22 pages — launch with these):
/, /about, /contact, /studio, /studio/services/product-development, /studio/services/rescue-ship, /studio/solutions/for-founders, /studio/portfolio, /studio/process, /studio/start-project, /services, /services/how-it-works, /services/plans, /services/get-protected, /labs, /labs/blog, /academy, /academy/free, /products, /blog, /careers, /legal

### Design Reference Sites:
- Linear.app — clean, purposeful, dark-first with light option
- Vercel.com — gradient meshes, typography hierarchy
- Stripe.com — information density without clutter
- Raycast.com — glassmorphic panels, premium feel
- Resend.com — minimal, beautiful spacing
