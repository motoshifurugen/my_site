# Project Architecture Documentation

Comprehensive technical documentation for Furugen's Island.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Core Features](#core-features)
5. [Component System](#component-system)
6. [Data Flow](#data-flow)
7. [API Routes](#api-routes)
8. [State Management](#state-management)
9. [Internationalization](#internationalization)
10. [Theming](#theming)
11. [Build & Deployment](#build--deployment)

---

## Overview

Furugen's Island is a personal portfolio and blog website built with modern web technologies. The project showcases:

- **Blog System**: MDX-powered posts with code highlighting, math rendering, and table of contents
- **Portfolio**: Skills timeline and work history
- **3D Game**: Crossy Road-style game built with Three.js
- **Tanka Collection**: Japanese poetry with database backend
- **Generative Art**: Interactive visualizations with p5.js

### Live Site
- **URL**: https://furugen-island.com/my_site
- **Hosting**: GitHub Pages (static export) for the site, Vercel for the API
- **Base Path**: `/my_site`

---

## Technology Stack

### Core Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.35 | React framework with App Router |
| React | 18 | UI library |
| TypeScript | 5 | Type-safe JavaScript |

### Styling
| Technology | Purpose |
|-----------|---------|
| Tailwind CSS 3.4.10 | Utility-first CSS framework |
| PostCSS | CSS processing |
| CSS Modules | Component-scoped styles |

### Content & Blog
| Technology | Purpose |
|-----------|---------|
| next-mdx-remote | MDX rendering |
| gray-matter | YAML frontmatter parsing |
| remark-gfm | GitHub Flavored Markdown |
| remark-math + rehype-katex | LaTeX math support |
| rehype-prism + prismjs | Syntax highlighting |
| tocbot | Table of contents generation |

### 3D & Animation
| Technology | Purpose |
|-----------|---------|
| Three.js (@react-three/fiber, @react-three/drei) | 3D graphics |
| GSAP | Complex animations |
| Framer Motion | React animations |
| tsparticles | Particle effects |
| p5.js (@p5-wrapper/react) | Generative art |

### State Management
| Technology | Purpose |
|-----------|---------|
| Zustand | Game state management |
| React Context | i18n, theme state |
| next-themes | Dark mode management |

### Backend & Data
| Technology | Purpose |
|-----------|---------|
| Supabase | Database for tanka poems |
| GitHub Issues API (@octokit/rest) | Like counter storage |
| Anthropic SDK | Claude AI integration |

### Development Tools
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| TypeScript | Type checking |

---

## Directory Structure

```
my_site/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (pages)/              # Route group (no URL segment)
│   │   │   ├── blog/             # Blog listing
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/       # Dynamic blog post route
│   │   │   │       ├── page.tsx
│   │   │   │       └── page.server.tsx
│   │   │   ├── book/             # Book recommendations
│   │   │   ├── contact/          # Contact form
│   │   │   ├── e-room/           # Photo gallery
│   │   │   ├── game/             # 3D Crossy Road game
│   │   │   ├── hugmi/            # Sub-project pages
│   │   │   ├── profile/          # About page
│   │   │   ├── rpg/              # RPG-style page
│   │   │   ├── skills/           # Portfolio & skills
│   │   │   ├── tanka/            # Japanese poetry collection
│   │   │   └── thankyou/         # Thank you page
│   │   ├── api/                  # API routes
│   │   │   ├── blog/             # Blog post retrieval
│   │   │   │   └── [slug]/route.ts
│   │   │   ├── highscore/        # Game high scores
│   │   │   ├── likes/            # GitHub Issues like counter
│   │   │   ├── og-fetch/         # Open Graph scraping
│   │   │   ├── tags/             # Tag filtering
│   │   │   ├── tanka/            # Tanka CRUD (Supabase)
│   │   │   └── tanka-likes/      # Tanka like system
│   │   ├── components/           # Atomic Design components
│   │   │   ├── atoms/            # Basic elements (21 files)
│   │   │   ├── molecules/        # Combined components (30 files)
│   │   │   ├── organisms/        # Complex sections (19 files)
│   │   │   ├── templates/        # Page layouts (6 files)
│   │   │   └── game/             # 3D game components (5 files)
│   │   ├── hooks/                # Custom React hooks
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── globals.css           # Global styles
│   │   ├── not-found.tsx         # 404 page
│   │   └── sitemap.ts            # SEO sitemap
│   ├── i18n/                     # Internationalization
│   │   ├── config.ts             # Locale configuration
│   │   ├── context.tsx           # i18n React context
│   │   ├── translations.ts       # Translation strings (ja/en)
│   │   ├── types.ts              # Type definitions
│   │   └── index.ts              # Public exports
│   ├── posts/                    # MDX blog posts
│   │   └── *.mdx                 # Individual posts
│   └── types/                    # TypeScript definitions
│       ├── posts.ts              # Blog post types
│       └── game-objects.ts       # Game entity types
├── public/                       # Static assets
├── img/                          # Image assets
├── scripts/                      # Build & utility scripts
├── .github/                      # GitHub workflows
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── .eslintrc.json
├── .prettierrc
└── vercel.json
```

---

## Core Features

### 1. Blog System

**Location**: `src/app/(pages)/blog/`, `src/posts/`

**Architecture**:
```
Blog Post Flow:
1. MDX files in /src/posts/
2. API route reads files with gray-matter
3. Page fetches via API and renders with next-mdx-remote
4. Syntax highlighting via Prism
5. Math rendering via KaTeX
6. Like counter via GitHub Issues
```

**MDX Frontmatter Schema**:
```yaml
---
title: "Post Title"
date: "2024-01-01"
tags: ["tag1", "tag2"]
---
```

**Features**:
- GitHub Flavored Markdown
- Code syntax highlighting
- LaTeX math equations
- Auto-generated table of contents
- Like counter (GitHub Issues backend)
- Tag-based filtering

### 2. 3D Game

**Location**: `src/app/(pages)/game/`, `src/app/components/game/`

**Architecture**:
```
Game Components:
├── Game.tsx         # Main game container
├── Player.tsx       # Player character (3D)
├── Rows.tsx         # Game rows (forest, road)
├── Row.tsx          # Individual row
└── stores/
    ├── game.ts      # Game state (Zustand)
    └── player.ts    # Player state
```

**Features**:
- Crossy Road-style gameplay
- Keyboard controls
- Score tracking
- High score persistence
- Orthographic 3D camera

### 3. Tanka Poetry

**Location**: `src/app/(pages)/tanka/`, `src/app/api/tanka/`

**Backend**: Supabase

**Features**:
- CRUD operations
- Tag filtering
- Like system (per user)
- Pagination

### 4. Internationalization

**Location**: `src/i18n/`

**Supported Locales**: Japanese (ja), English (en)

**Features**:
- Context-based locale management
- localStorage persistence
- URL path detection fallback
- Comprehensive translation keys

---

## Component System

### Atomic Design Hierarchy

```
                    ┌─────────────┐
                    │  Templates  │  Page layouts
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Organisms  │  Complex sections
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Molecules  │  Combined components
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Atoms    │  Basic elements
                    └─────────────┘
```

### Atoms (Basic Elements)
| Component | Purpose |
|-----------|---------|
| TitleAnimation | Animated title text |
| SubmitButton | Form submit button |
| Highlight | Text highlighter |
| LoadingCircle | Loading spinner |
| GoogleAnalytics | Analytics script |
| TocScrollManager | TOC scroll handling |

### Molecules (Combined Components)
| Component | Purpose |
|-----------|---------|
| BlogCard | Blog post preview card |
| InputText | Form input with label |
| Tags | Tag list display |
| LikeButton | Like interaction button |
| CodeBlock | Syntax-highlighted code |
| UrlCard | URL preview card |
| SnsIcon | Social media icon button |

### Organisms (Complex Sections)
| Component | Purpose |
|-----------|---------|
| BlogGrid | Grid of blog cards |
| MessageBoard | Contact form |
| SkillTimeline | Skills display |
| WorkList | Work history |
| ThemeSwitch | Dark/light toggle |
| TopSection | Hero section |

### Templates (Page Layouts)
| Component | Purpose |
|-----------|---------|
| Header | Site navigation |
| Footer | Site footer |
| Sidebar | Page sidebar |
| ClientWrapper | Client-side provider wrapper |
| ArticleContent | Blog article layout |
| BackgroundWrapper | Background decorations |

---

## Data Flow

### Client-Side Data Fetching

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │────▶│  useEffect  │────▶│  fetch()    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
┌─────────────┐     ┌─────────────┐     ┌──────▼──────┐
│   Render    │◀────│  useState   │◀────│  API Route  │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Server-Side Data Fetching

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Server Comp │────▶│   fetch()   │────▶│  External   │
│   (page)    │     │  (cached)   │     │    API      │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│   Render    │
│    HTML     │
└─────────────┘
```

---

## API Routes

### Blog API

**Endpoint**: `GET /api/blog/[slug]`

**Response**:
```typescript
{
  slug: string
  title: string
  date: string
  tags: string[]
  content: string  // Raw MDX content
}
```

### Likes API (GitHub Issues)

**Endpoints**:
- `GET /api/likes?articleId={id}` - Get like count
- `POST /api/likes` - Increment like count

**Storage**: GitHub Issues (title: `likes-{articleId}`)

### Tanka API (Supabase)

**Endpoints**:
- `GET /api/tanka` - List poems (with pagination)
- `POST /api/tanka` - Create poem
- `GET /api/tanka-likes` - Get like status
- `POST /api/tanka-likes` - Toggle like

### Tags API

**Endpoint**: `GET /api/tags`

**Response**: Array of tag objects

---

## State Management

### Game State (Zustand)

```typescript
// src/app/components/game/stores/game.ts
interface StoreState {
  status: 'running' | 'over'
  score: number
  updateScore: (rowIndex: number) => void
  endGame: () => void
  reset: () => void
}
```

### Player State

```typescript
// src/app/components/game/stores/player.ts
export const state = {
  currentRow: number
  currentTile: number
  movesQueue: MoveDirection[]
  ref: Object3D | null
}

export function queueMove(direction: MoveDirection) { ... }
export function stepCompleted() { ... }
```

### i18n Context

```typescript
// src/i18n/context.tsx
interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationKeys
}
```

### Theme Context

Managed by `next-themes`:
- `theme`: 'light' | 'dark' | 'system'
- Persisted to localStorage
- System preference detection

---

## Internationalization

### Configuration

```typescript
// src/i18n/config.ts
export const locales = ['ja', 'en'] as const
export const defaultLocale = 'ja'
```

### Translation Structure

```typescript
// src/i18n/translations.ts
export const translations = {
  ja: {
    common: {
      home: 'ホーム',
      blog: 'ブログ',
      // ...
    },
    blog: {
      title: 'ブログ',
      readMore: '続きを読む',
      // ...
    },
    // ...
  },
  en: {
    common: {
      home: 'Home',
      blog: 'Blog',
      // ...
    },
    // ...
  },
}
```

### Usage

```typescript
'use client'
import { useI18n } from '@/i18n'

function Component() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div>
      <h1>{t.blog.title}</h1>
      <button onClick={() => setLocale('en')}>English</button>
    </div>
  )
}
```

---

## Theming

### Color Palette

```typescript
// tailwind.config.ts
colors: {
  'main-white': '#f7f7f3',
  'main-black': '#233544',
  'night-white': '#F2F2F2',
  'night-black': '#222831',
  'night-teal': '#99e1d9',
  'night-gray': '#414952',
  'night-orange': '#f66b0e',
  'like-pink': '#FF0080',
  teal: {
    50: '#E6FAF9',
    // ... full palette
    900: '#003D36',
  },
  orange: '#ff7340',
}
```

### Dark Mode Implementation

1. **Tailwind Config**: `darkMode: 'class'`
2. **Provider**: `next-themes` ThemeProvider
3. **Usage**: `className="bg-white dark:bg-black"`

### Custom Animations

```typescript
// tailwind.config.ts
animation: {
  'cloud-move-1': 'cloud-move-1 60s linear infinite',
  'twinkle-1': 'twinkle 3s ease-in-out infinite',
  'shooting-star-1': 'shooting-star 6s linear infinite',
}
```

---

## Build & Deployment

### Scripts

```json
{
  "dev": "next dev",
  "build": "prettier --write \"src/**/*.{ts,tsx}\" && next build",
  "start": "next start",
  "start:api": "next dev -p 3001",
  "test": "node --import tsx --test $(find src -name '*.test.ts')",
  "lint": "run-p -l -c --aggregate-output lint:*",
  "fix": "run-s fix:prettier fix:eslint",
  "deploy": "npm run build && touch out/.nojekyll && git add -f out && git commit -m 'Deploy to GitHub Pages' && git push origin `git subtree split --prefix out master`:gh-pages --force"
}
```

> The `deploy` script is a legacy artifact: with `output: "export"` disabled in `next.config.mjs`, `next build` does not emit `out/`, so `touch out/.nojekyll` fails. The CI workflow below is the canonical deployment path.

### Next.js Configuration

```javascript
// next.config.mjs
{
  images: { unoptimized: true },
  basePath: '/my_site',
  assetPrefix: production ? '/my_site/' : '',
  staticPageGenerationTimeout: 60
}
```

### Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Public (build-time) | API base URL |
| `GITHUB_TOKEN` | Server | GitHub API auth |
| `GITHUB_OWNER` | Server | Repository owner |
| `GITHUB_REPO` | Server | Repository name |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Supabase auth |
| `ANTHROPIC_API_KEY` | Server | Claude API key |

`NEXT_PUBLIC_API_URL` is inlined at build time and points the static site at the API host. Its value differs per environment:

| Environment | Value | Source |
|-------------|-------|--------|
| Local (`npm run dev`) | unset → code fallback (`http://localhost:3000/my_site/api` or `/my_site/api`) | `.env.local` (commented out) |
| Production | `https://furugen-island.com/my_site/api` | `.env.production` |
| CI (GitHub Pages build) | `https://my-site-nine-opal.vercel.app/my_site/api` | `.github/workflows/nextjs.yml` |
| Docker | `/my_site/api` | `docker-compose.yml` |

> `API_URL` is declared in `docker-compose.yml` only and is **not referenced anywhere in the source** (`process.env.API_URL` has zero usages); it has no effect on the running app.

### Deployment

**Platform**: GitHub Pages (static site) + Vercel (API)

The site is split into two hosting targets:
- **Static site**: deployed to GitHub Pages by CI.
- **API**: hosted on Vercel; the static site reaches it via `NEXT_PUBLIC_API_URL`.

**vercel.json** only configures a redirect (not a framework preset):
```json
{
  "redirects": [
    { "source": "/", "destination": "/my_site", "permanent": true }
  ]
}
```

**Canonical build & deploy (`.github/workflows/nextjs.yml`)**:
1. Triggered by a push to `main` (or manual `workflow_dispatch`).
2. `actions/configure-pages` injects `output: export` (via `static_site_generator: next`) so the build produces a static export — `next.config.mjs` keeps `output: "export"` commented out and relies on this.
3. `NEXT_PUBLIC_API_URL` is set to the Vercel API URL, then `next build` emits the static site to `out/`.
4. `actions/upload-pages-artifact` uploads `out/`, and `actions/deploy-pages` publishes it to GitHub Pages.

The custom domain (`furugen-island.com`) is configured outside this repository (no `CNAME` file is tracked here).

---

## Performance Optimizations

1. **Static Generation**: Blog posts use `generateStaticParams()`
2. **Image Optimization**: Next.js Image component
3. **Code Splitting**: Dynamic imports for heavy components
4. **Caching**: fetch cache strategies
5. **Font Optimization**: Self-hosted fonts with preload

---

## Security Considerations

1. **Environment Variables**: Sensitive data in server-only env vars
2. **API Validation**: Input validation on all API routes
3. **CORS**: API routes handle cross-origin appropriately
4. **Authentication**: Service role keys for database operations
