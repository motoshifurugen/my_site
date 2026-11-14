# Project Architecture Documentation

Comprehensive technical documentation for Furugen Island.

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

Furugen Island is a personal portfolio and blog website built with modern web technologies. The project showcases:

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
| Next.js | 16.4.5 | React framework with App Router |
| React | 19 | UI library |
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
| prismjs (server-side highlighting) | Syntax highlighting |
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
├── eslint.config.mjs
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
- Search box on the blog list: filters by title, tag, and the start of the body. The search runs in the browser against `/blog/search-index.json`, which is written at build time.
- Tag list with post counts: clicking a tag shows only its posts
- Per-post OG image: the build writes a 1200×630 PNG with the post title to `/blog/<slug>/og.png` (`src/app/(pages)/blog/[slug]/og.png/route.tsx`). Post pages point `og:image` at it and use `twitter:card` `summary_large_image`. Fonts come from `@fontsource/noto-sans-jp`, and emoji are dropped from the title, so rendering makes no network requests.
- Share section at the end of each post (before related posts): a closing note, links to share on X and Hatena Bookmark, and a copy-link button

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
3. `NEXT_PUBLIC_API_URL` is set to the Vercel API URL.
4. The step `Exclude API route handlers from static export` deletes every route handler before the build:
   ```bash
   find src/app/api \( -name 'route.tsx' -o -name 'route.ts' \) -delete
   ```
   `output: export` cannot build `force-dynamic` or request-dependent route handlers (it stops with `export const dynamic = "force-dynamic" on page "/api/og-fetch" cannot be used with "output: export"`). The API runs on Vercel, so the static build does not need them.
5. `next build` emits the static site to `out/` (no `out/api`).
6. `actions/upload-pages-artifact` uploads `out/`, and `actions/deploy-pages` publishes it to GitHub Pages.

The exclusion holds only while these rules hold:

- Put dynamic route handlers only in `src/app/api/**/route.ts(x)`. A dynamic handler elsewhere survives the delete and breaks the Pages build.
- A `force-static` route handler may live outside `src/app/api`. It survives the delete, and the Pages build writes its response to `out/` (for example, `src/app/(pages)/blog/search-index.json/route.ts` becomes `out/blog/search-index.json`).
- Do not import a route file from a page or component. CI deletes it, so the import breaks the build.
- Non-route modules under `src/app/api` stay in the build. For example, the blog pages and `src/app/sitemap.ts` import `src/app/api/utils/getPostData.tsx`, so it must keep working in a static build.

**Reproducing the Pages build locally**:

Run these steps in a separate worktree, not in your checkout. Steps 3 and 4 edit and delete tracked files, so running them in your checkout would destroy uncommitted changes to `src/app/api` and `next.config.mjs`. The worktree checks out `HEAD`, so commit what you want to test first.

1. `git worktree add --detach ../my_site-pages-build HEAD`, then run steps 2–5 inside `../my_site-pages-build`.
2. Run `npm ci` so `node_modules` matches the lock file. Stale dependencies can fail the build with type errors unrelated to the export.
3. Uncomment `// output: "export",` in `next.config.mjs`.
4. `find src/app/api \( -name 'route.tsx' -o -name 'route.ts' \) -delete`
5. `npx next build`, then check that `out/` exists and `out/api` does not.
6. From your checkout, run `git worktree remove --force ../my_site-pages-build`. The worktree has modified tracked files, so `git worktree remove` refuses without `--force`.

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

### Supabase keys and Row Level Security

- Use the service-role key (`SUPABASE_SERVICE_ROLE_KEY`) only on the server: the API routes on Vercel and the Python scripts in GitHub Actions. Never give it a `NEXT_PUBLIC_` prefix.
- Do not use the anon (publishable) key in the frontend. The frontend has no reason to reach the database directly: only the API on Vercel, using the service role, writes likes and checks whether an IP has liked a tanka. `src/supabase-rls-migration.test.ts` fails if `NEXT_PUBLIC_SUPABASE` or `SUPABASE_ANON_KEY` appears under `src`.
- RLS is a second layer. `scripts/migrations/008_enable_rls.sql` enables it on every table. Only `tanka` and `tags` have a policy, and it allows `SELECT` to `anon` and `authenticated`. No table has a write policy, so only the service role can write.
- `tanka_likes` has a `user_ip` column. It has RLS enabled and no policy, and 008 revokes all privileges on it from `anon` and `authenticated`. A direct `SELECT` by either role fails with `permission denied for table tanka_likes`. Without the `REVOKE`, the missing policy would only make the `SELECT` return zero rows.
- `anon` and `authenticated` can read like counts only through the view `tanka_like_counts` (`tweet_id`, `tanka`, `created_at`, `like_count`). 008 grants `SELECT` on it to both roles. Do not add `user_ip` or `liked_at` to the view.
- The view does not set `security_invoker`, on purpose. It runs with its owner's privileges, so it counts rows in `tanka_likes` past RLS and the `REVOKE`, but it returns only counts. With `security_invoker = on`, the view would read `tanka_likes` as `anon`, hit the `REVOKE`, and `anon` could no longer read the counts.
- The site still gets like counts from `/my_site/api/tanka-likes`, which counts rows in `tanka_likes` with the service role. The `REVOKE` does not touch the service role, so the counts on the /tanka page stay the same.
- The service role bypasses RLS. RLS does not protect the data if the service-role key leaks.
- When you add a table, enable RLS on it in the same migration. The test above fails if a table created in `scripts/migrations` lacks `ENABLE ROW LEVEL SECURITY`.

### Applying 008_enable_rls.sql and rolling it back

008 is not applied to production yet. Apply it only after the CEO approves. The rollback SQL lives in one place, the header comment of `scripts/migrations/008_enable_rls.sql`; this section points to it instead of copying it.

0. Before you apply it, record the current state.
   - Run this query and keep the result:
     ```sql
     SELECT table_name, grantee, privilege_type
     FROM information_schema.role_table_grants
     WHERE table_name IN ('tanka_likes', 'tanka_like_counts')
       AND grantee IN ('anon', 'authenticated');
     ```
   - Pick one tanka. Record `likeCount` from `GET /my_site/api/tanka-likes?tweetId=<id>` on the Vercel API, and the count the /tanka page shows for it.
1. In the Supabase SQL Editor, run the whole of `008_enable_rls.sql`.
2. Check the result.
   - (a) A direct `SELECT` by `anon` fails with `permission denied for table tanka_likes`:
     ```sql
     BEGIN; SET LOCAL ROLE anon; SELECT * FROM tanka_likes LIMIT 1; ROLLBACK;
     ```
   - (b) The same query with `SET LOCAL ROLE authenticated` fails the same way.
   - (c) `anon` can read the counts from the view:
     ```sql
     BEGIN; SET LOCAL ROLE anon; SELECT tweet_id, like_count FROM tanka_like_counts LIMIT 5; ROLLBACK;
     ```
   - (d) An `INSERT` by `anon` fails with `permission denied for table tanka_likes`:
     ```sql
     BEGIN; SET LOCAL ROLE anon; INSERT INTO tanka_likes (tweet_id, user_ip) VALUES (<id>, '192.0.2.1'); ROLLBACK;
     ```
   - (e) The API and the /tanka page show the same `likeCount` as in step 0.
   - (f) Like the tanka on the /tanka page: the count goes up by one. Unlike it: the count goes back. This shows that writes by the service role still work.
3. To roll back, run the rollback SQL in the header comment of `008_enable_rls.sql`. Then run the query from step 0 again and check that the privileges match what you recorded. The rollback SQL assumes the step 0 record shows the Supabase default (`anon` and `authenticated` hold all privileges on `tanka_likes`). If your record differs, change its `GRANT` to match the record. The header also says when to revoke the `SELECT` on `tanka_like_counts`.
