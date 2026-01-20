# CLAUDE.md - AI Assistant Context

This file provides context for AI assistants working with this project.

## Project Overview

**Furugen's Island** - A personal portfolio and blog website built with Next.js 14 (App Router), featuring:
- MDX-based blog system with code highlighting and math rendering
- 3D game built with Three.js
- Tanka (Japanese poetry) collection with Supabase backend
- Internationalization (Japanese/English)
- Dark/Light theme support

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 3.4.10
- **State Management**: Zustand (game), React Context (i18n, theme)
- **3D Graphics**: Three.js via @react-three/fiber
- **Animation**: GSAP, Framer Motion
- **Database**: Supabase (tanka poems)
- **External APIs**: GitHub Issues (like counter), Anthropic (Claude)

## Project Structure

```
src/
├── app/
│   ├── (pages)/           # Route group for pages
│   │   ├── blog/          # Blog with [slug] dynamic route
│   │   ├── game/          # 3D crossy-road style game
│   │   ├── tanka/         # Japanese poetry collection
│   │   ├── profile/       # About page
│   │   ├── skills/        # Portfolio
│   │   └── ...
│   ├── api/               # API routes
│   │   ├── blog/          # MDX file serving
│   │   ├── likes/         # GitHub Issues integration
│   │   ├── tanka/         # Supabase CRUD
│   │   └── ...
│   ├── components/        # Atomic Design structure
│   │   ├── atoms/         # Basic elements
│   │   ├── molecules/     # Combined components
│   │   ├── organisms/     # Complex sections
│   │   ├── templates/     # Page layouts
│   │   └── game/          # 3D game components
│   └── hooks/             # Custom React hooks
├── i18n/                  # Internationalization
├── posts/                 # MDX blog posts
└── types/                 # TypeScript definitions
```

## Key Commands

```bash
npm run dev      # Start development server
npm run build    # Format + build for production
npm run lint     # Run ESLint
npm run fix      # Auto-fix linting issues
```

## Component Architecture

This project follows **Atomic Design** methodology:
- **Atoms**: TitleAnimation, SubmitButton, Highlight, LoadingCircle
- **Molecules**: BlogCard, InputText, Tags, LikeButton, CodeBlock
- **Organisms**: BlogGrid, MessageBoard, SkillTimeline, WorkList
- **Templates**: Header, Footer, Sidebar, ClientWrapper

## Important Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with providers |
| `src/app/components/templates/ClientWrapper.tsx` | Client-side wrapper with i18n/theme |
| `src/i18n/translations.ts` | All translation strings |
| `tailwind.config.ts` | Custom theme colors and animations |
| `next.config.mjs` | Next.js config with basePath `/my_site` |

## Coding Conventions

### TypeScript
- Strict mode enabled
- Use interfaces for component props
- Types defined in `src/types/`
- Avoid `any` type

### Components
- Use `'use client'` directive when needed (state, effects, context)
- PascalCase for component names
- camelCase for functions and variables
- Props interface named `{ComponentName}Props`

### Styling
- Tailwind utility classes first
- CSS Modules for component-specific styles (`.module.css`)
- Dark mode: use `dark:` prefix
- Custom colors: `main-white`, `main-black`, `night-*`, `teal-*`

### File Naming
- Components: PascalCase (`BlogCard.tsx`)
- Hooks: camelCase with `use` prefix (`useLikeCount.ts`)
- Utils: camelCase (`formatDate.ts`)

## Environment Variables

```env
NEXT_PUBLIC_API_URL=       # Public API endpoint
GITHUB_TOKEN=              # GitHub API for likes
GITHUB_OWNER=              # GitHub username
GITHUB_REPO=               # Repository name
SUPABASE_URL=              # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY= # Supabase auth key
ANTHROPIC_API_KEY=         # Claude API key
```

## Common Patterns

### Data Fetching
```typescript
// Server component
const res = await fetch(`${apiUrl}/blog/`, { cache: 'force-cache' })

// Client hook
useEffect(() => {
  fetch(`/api/likes?articleId=${id}`).then(...)
}, [id])
```

### i18n Usage
```typescript
'use client'
const { locale, setLocale, t } = useI18n()
return <h1>{t.blog.title}</h1>
```

### Dark Mode
```tsx
<div className="bg-main-white dark:bg-main-black">
```

## Deployment

- **Platform**: Vercel
- **Base Path**: `/my_site`
- **Build**: Prettier formatting runs before build

## Notes for AI Assistants

1. Always check if a component needs `'use client'` directive
2. Follow Atomic Design when creating new components
3. Add translations to `src/i18n/translations.ts` for any user-facing text
4. Use existing Tailwind theme colors rather than arbitrary values
5. Test dark mode compatibility for UI changes
6. Blog posts go in `src/posts/` as MDX files with YAML frontmatter
