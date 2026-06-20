# Verdant 🌿 — Grow a Lighter Footprint

**Understand, track, and reduce your carbon footprint through simple actions and personalized insights.**

Verdant is a modern, single-page web application that helps individuals understand their carbon emissions, provides AI-powered personalized recommendations, and uses gamification to make sustainable living addictive.

![Built with React 19](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)
![100% Client-Side](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen)
![No Backend](https://img.shields.io/badge/Backend-None-success)

---

## ✨ Features

### 📊 Carbon Footprint Calculator
- **14-question lifestyle survey** covering transport, diet, home energy, and lifestyle
- Real-time estimation with cited emission factors (UK BEIS / IPCC AR6)
- Instant breakdown by category with animated charts

### 🎯 Personalized Reduction Actions
- 24+ curated actions ranked by **impact for YOUR lifestyle**
- One-tap commitment with savings tracking (kg CO₂/year)
- Difficulty ratings (Easy / Medium / Ambitious)

### 🤖 AI Chatbot — "Sage"
- **Runs 100% locally in your browser** — no API keys, no cloud, no data leakage
- Keyword-based intent classification with curated knowledge base
- **Personalized responses** that reference your actual footprint data
- Streaming typing animation for a natural feel
- Zero hallucination risk (all responses are pre-authored)

### 🏆 Gamification (Addictive Loop)
- **Daily check-in** with streak tracking (Duolingo-style)
- **Streak freeze** — save a missed day once per streak
- **XP system** — earn points for check-ins, survey, actions, challenges
- **6 levels**: Seed → Sprout → Sapling → Oak → Guardian → Champion
- **10 achievement badges** for milestones
- **Weekly rotating challenges** with progress tracking
- **Confetti celebrations** on milestones

### 🌳 Growing Tree
- Animated SVG tree that **visibly thrives** as your footprint improves
- Morphs from seed → seedling → sapling → oak → guardian → champion

### 🔒 Privacy & Security
- **100% client-side** — zero network calls, zero analytics, zero cookies
- **Content Security Policy** meta tag restricting all resources
- **Input sanitization** layer for chatbot and user-generated content
- **Full data inventory** — see exactly what's stored
- **One-click export** (JSON) and **complete data wipe**
- All data namespaced under `verdant:` in localStorage

### 🎨 Design & Animations
- Clean, modern UI with **leaf-green / amber / earth-ink** palette
- **Framer Motion** page transitions, stagger reveals, and micro-interactions
- Animated SVG progress rings, number counters, and gradient meshes
- **Floating leaf particle** background (respects `prefers-reduced-motion`)
- Dark mode with system preference detection
- Fully responsive (mobile-first)
- Custom scrollbar, glass morphism cards, magnetic hover effects

---

## 🏗️ Architecture

```
verdant/
├── index.html              # CSP meta tag, favicon
├── package.json
├── vite.config.js
├── tailwind.config.js      # Custom leaf/amber/earth palette + animations
├── postcss.config.js
├── eslint.config.js
├── .gitignore
├── README.md
├── SECURITY.md
└── src/
    ├── main.jsx             # Entry point with BrowserRouter
    ├── App.jsx              # Route definitions + AnimatePresence
    ├── index.css            # Global styles, glass cards, utility classes
    ├── components/
    │   ├── Navbar.jsx       # Responsive nav with streak/XP badges
    │   ├── Footer.jsx       # Minimal footer with privacy badge
    │   ├── LeafBackground.jsx # Floating leaf particles (GPU-friendly)
    │   ├── PageTransition.jsx
    │   └── ui/
    │       ├── Reveal.jsx       # Fade+slide reveal + stagger container
    │       ├── StatCounter.jsx  # Animated number counter
    │       ├── Ring.jsx         # SVG progress ring with gradient
    │       ├── Badge.jsx        # Badge display + grid
    │       ├── Confetti.jsx     # Lightweight canvas confetti
    │       ├── Modal.jsx        # Animated modal overlay
    │       ├── Skeleton.jsx     # Shimmer placeholder
    │       └── Toast.jsx        # Toast notification system
    ├── pages/
    │   ├── Home.jsx         # Dashboard: tree, ring, streak, insight, actions
    │   ├── Onboard.jsx      # 14-step animated survey wizard
    │   ├── Breakdown.jsx    # Category charts, country comparison, Paris target
    │   ├── Reduce.jsx       # Ranked action cards with commit toggles
    │   ├── Chat.jsx         # AI chatbot "Sage" with streaming text
    │   ├── Challenges.jsx   # Weekly challenges with XP rewards
    │   ├── Privacy.jsx      # Security showcase + data inventory + export/wipe
    │   └── NotFound.jsx     # 404 page
    ├── data/
    │   ├── survey.js        # 14 questions with emission factors (kg CO₂e)
    │   ├── engine.js        # Footprint calculation + category breakdown
    │   ├── actions.js       # 24+ reduction actions with savings estimates
    │   ├── challenges.js    # Weekly challenge pool + rotation logic
    │   ├── badges.js        # 6 levels + 10 achievement badges
    │   ├── knowledge.js     # Sage AI knowledge base (10 topic clusters)
    │   └── countries.js     # Per-capita averages for 10 countries
    └── lib/
        ├── hooks.js         # useLocalStorage, useTheme, useInViewOnce
        ├── store.js         # All localStorage-backed state management
        ├── chat.js          # Local AI intent classifier + response engine
        ├── security.js      # Sanitize, export, wipe, data inventory
        └── format.js        # Date/number formatting utilities
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🧪 Testing

Verdant ships with a comprehensive test suite built on **Vitest** and **@testing-library/react**.

```bash
# Run all tests once (CI-friendly)
npm test

# Run tests in watch mode (during development)
npm run test:watch

# Generate a coverage report
npm run test:coverage
```

### Test Coverage

The suite covers **155 tests across 16 files**, organized by layer:

| Layer | Files | Tests | Focus |
|-------|-------|-------|-------|
| **Data** | `engine`, `actions`, `challenges`, `badges` | 57 | Carbon math, ranking, XP/levels, badge conditions |
| **Lib** | `security`, `format`, `chat` | 52 | Sanitization, exports, formatting, AI intent matching |
| **Components** | `Navbar`, `Footer`, `Badge` | 14 | Rendering, links, props |
| **Pages** | `Home`, `Onboard`, `Chat`, `Privacy`, `Challenges` | 18 | Routing, content, user flows |
| **Integration** | `App` | 6 | Full app routing, layout presence |

### Test Highlights

- **Carbon engine**: verifies category math, household splitting (×1, ×4), Paris target deltas
- **Security**: validates XSS sanitization (`<script>`, `<img onerror>`, entities) and data wipe
- **AI chatbot**: checks intent classification for greetings, footprint queries, personalization
- **Gamification**: asserts all 10 badge conditions trigger correctly at milestones
- **Accessibility**: verifies `aria-label`s, button roles, and form associations render

Tests live alongside source under `__tests__/` directories (e.g. `src/data/__tests__/`).

---

## ♿ Accessibility

Verdant is built to be usable by everyone:

- **Semantic HTML** — proper `<main>`, `<nav>`, `<header>`, `<footer>` landmarks
- **Skip-to-content** link for keyboard users (visible on focus)
- **Focus-visible** rings on every interactive element
- **ARIA** roles and labels — `role="dialog"`, `aria-modal`, `aria-live`, `aria-checked`
- **Reduced-motion** support — disables animations for users who prefer it
- **Keyboard navigation** — Esc closes modals, Enter submits chat, Tab flows logically
- **Color contrast** — WCAG AA compliant palette in both light and dark modes

---

## 🔐 Security Model

See [SECURITY.md](./SECURITY.md) for the full security documentation.

| Aspect | Implementation |
|--------|---------------|
| Data storage | 100% localStorage, namespaced `verdant:` |
| Network calls | Zero (only Google Fonts for UI) |
| AI chatbot | Local rule-based engine, no API keys |
| Content Security | CSP meta tag restricting scripts/styles/connections |
| Input handling | Sanitization layer on all user-generated content |
| Data portability | One-click JSON export |
| Data erasure | One-click complete wipe |
| Cookies | None |
| Analytics | None |
| Authentication | None (no account needed) |

---

## 🧮 Emission Sources

All emission factors are conservative approximations from publicly available sources:

- **UK Department for Business, Energy & Industrial Strategy (BEIS)** — conversion factors
- **IPCC AR6** — per-capita emission benchmarks
- **EPA** — household energy averages
- **Our World in Data** — country-level per-capita data
- **Peer-reviewed lifecycle studies** — food and product emissions

Values are rounded for clarity. Verdant is an **awareness tool**, not an audit-grade calculator.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 3.4 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Lucide React | Icon library |
| React Router 7 | Client-side routing |
| Vitest | Unit/integration testing |
| Testing Library | Component testing |

**Zero additional runtime dependencies.** No backend, no database, no third-party services.

---

## 📄 License

MIT
