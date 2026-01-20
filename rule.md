# Coding Rules & Conventions

This document defines the coding standards and architectural patterns for this project.

## Table of Contents

1. [TypeScript Rules](#typescript-rules)
2. [React & Next.js Patterns](#react--nextjs-patterns)
3. [Component Architecture](#component-architecture)
4. [Styling Guidelines](#styling-guidelines)
5. [State Management](#state-management)
6. [API & Data Fetching](#api--data-fetching)
7. [File & Folder Structure](#file--folder-structure)
8. [Git & Version Control](#git--version-control)

---

## TypeScript Rules

### Strict Mode
- TypeScript strict mode is enabled (`strict: true`)
- All code must pass strict type checking

### Type Definitions
```typescript
// Good: Interface for props
interface BlogCardProps {
  title: string
  slug: string
  date: string
  tags: string[]
}

// Good: Type for union types
type Locale = 'ja' | 'en'
type Status = 'running' | 'over'

// Avoid: any type
const data: any = fetchData() // Bad
const data: Post[] = fetchData() // Good
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Interface | PascalCase | `BlogCardProps` |
| Type | PascalCase | `PostType` |
| Enum | PascalCase | `Direction` |
| Generic | Single uppercase | `T`, `K`, `V` |

### Import Order (enforced by Prettier)
1. React imports
2. Next.js imports
3. External libraries
4. Internal modules (`@/`)
5. Relative imports
6. Type imports

---

## React & Next.js Patterns

### Server vs Client Components

```typescript
// Server Component (default) - No directive needed
// Use for: Static content, data fetching, metadata
export default async function Page() {
  const data = await fetchData()
  return <div>{data.title}</div>
}

// Client Component - Requires directive
'use client'
// Use for: useState, useEffect, event handlers, browser APIs
export default function InteractiveComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### When to Use `'use client'`
- Using React hooks (useState, useEffect, useContext, etc.)
- Using browser APIs (window, document, localStorage)
- Event handlers (onClick, onChange, etc.)
- Using context providers
- Animation libraries (GSAP, Framer Motion)

### Component Structure
```typescript
'use client' // Only if needed

import { useState, useEffect } from 'react'
import { useI18n } from '@/i18n'

interface ComponentProps {
  title: string
  children?: React.ReactNode
}

export default function Component({ title, children }: ComponentProps) {
  // 1. Hooks
  const { t } = useI18n()
  const [state, setState] = useState<string>('')

  // 2. Effects
  useEffect(() => {
    // Side effects
  }, [])

  // 3. Handlers
  const handleClick = () => {
    setState('clicked')
  }

  // 4. Render
  return (
    <div className="container">
      <h1>{title}</h1>
      {children}
    </div>
  )
}
```

### Custom Hooks
```typescript
// File: src/app/hooks/useLikeCount.ts
export const useLikeCount = (articleId: string) => {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLikeCount(articleId)
      .then(setCount)
      .finally(() => setLoading(false))
  }, [articleId])

  return { count, loading }
}
```

---

## Component Architecture

### Atomic Design Structure

```
components/
├── atoms/       # Smallest, indivisible elements
├── molecules/   # Combinations of atoms
├── organisms/   # Complex, self-contained sections
├── templates/   # Page-level layouts
└── game/        # Domain-specific (3D game)
```

### Atoms
- Single responsibility
- No internal state (unless necessary)
- Receive all data via props
- Examples: Button, Input, Icon, Text

```typescript
// atoms/SubmitButton.tsx
interface SubmitButtonProps {
  label: string
  disabled?: boolean
  onClick: () => void
}

export default function SubmitButton({ label, disabled, onClick }: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 bg-teal-500 text-white rounded"
    >
      {label}
    </button>
  )
}
```

### Molecules
- Compose multiple atoms
- May have local state
- Handle simple interactions
- Examples: BlogCard, InputText, Tags

### Organisms
- Complex, self-contained sections
- Can fetch their own data
- May use context
- Examples: BlogGrid, Header, Footer

### Templates
- Define page layouts
- Handle global state
- Wrap with providers
- Examples: ClientWrapper, ArticleContent

---

## Styling Guidelines

### Tailwind CSS First
```tsx
// Good: Use Tailwind utilities
<div className="flex items-center gap-4 p-4 bg-main-white dark:bg-main-black">

// Avoid: Inline styles
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### Dark Mode
```tsx
// Always consider dark mode
<p className="text-main-black dark:text-main-white">

// Background colors
<div className="bg-main-white dark:bg-main-black">
```

### Custom Theme Colors
Use defined colors from `tailwind.config.ts`:
- `main-white`, `main-black` - Primary backgrounds
- `night-white`, `night-black` - Night theme
- `night-teal`, `night-gray`, `night-orange` - Accents
- `teal-50` to `teal-900` - Teal palette
- `orange` - Accent color
- `like-pink` - Like button color

### Responsive Design
```tsx
// Mobile first approach
<div className="px-4 md:px-8 xl:px-16">
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
```

### CSS Modules (When Needed)
Use for component-specific styles that can't be achieved with Tailwind:
```typescript
import styles from './ArticleContent.module.css'

<article className={styles.content}>
```

### Animation Classes
Custom animations defined in Tailwind config:
- `animate-cloud-*` - Cloud movement
- `animate-twinkle-*` - Star twinkling
- `animate-shooting-star-*` - Shooting stars

---

## State Management

### Local State (useState)
Use for component-specific state:
```typescript
const [isOpen, setIsOpen] = useState(false)
```

### Context (Global Settings)
Use for app-wide settings:
- `useI18n()` - Locale and translations
- `useTheme()` - Dark/Light mode

### Zustand (Complex State)
Use for complex, shared state (e.g., game):
```typescript
// stores/game.ts
import { create } from 'zustand'

interface GameStore {
  score: number
  status: 'running' | 'over'
  updateScore: (score: number) => void
  endGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  score: 0,
  status: 'running',
  updateScore: (score) => set({ score }),
  endGame: () => set({ status: 'over' }),
}))
```

---

## API & Data Fetching

### API Route Structure
```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await saveData(body)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save' },
      { status: 500 }
    )
  }
}
```

### Server-Side Fetching
```typescript
// In Server Components
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
  cache: 'force-cache', // or 'no-store' for dynamic
})
const data = await res.json()
```

### Client-Side Fetching
```typescript
// In Client Components
useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/likes')
      const data = await res.json()
      setData(data)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])
```

---

## File & Folder Structure

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Component | PascalCase | `BlogCard.tsx` |
| Hook | camelCase with `use` | `useLikeCount.ts` |
| Utility | camelCase | `formatDate.ts` |
| Type file | camelCase | `posts.ts` |
| CSS Module | PascalCase.module.css | `ArticleContent.module.css` |
| API route | route.ts | `api/blog/route.ts` |

### Page Files
```
(pages)/
├── blog/
│   ├── page.tsx           # Blog list page
│   └── [slug]/
│       ├── page.tsx       # Client component
│       └── page.server.tsx # Server component (if needed)
```

### Component Files
```
components/
├── atoms/
│   └── SubmitButton.tsx
├── molecules/
│   └── BlogCard.tsx
└── organisms/
    └── BlogGrid.tsx
```

---

## Git & Version Control

### Commit Messages
Follow conventional commits:
```
feat: add dark mode toggle
fix: resolve blog pagination issue
refactor: reorganize component structure
docs: update README
style: format code with prettier
test: add unit tests for hooks
```

### Branch Naming
```
feature/add-comment-system
fix/blog-loading-error
refactor/component-structure
```

### Pre-commit
- Prettier formatting runs automatically
- ESLint checks must pass

---

## Internationalization (i18n)

### Adding Translations
1. Add keys to `src/i18n/translations.ts`
2. Add both Japanese (ja) and English (en) values
3. Use in components:

```typescript
const { t } = useI18n()
return <h1>{t.blog.title}</h1>
```

### Translation Structure
```typescript
// src/i18n/translations.ts
export const translations = {
  ja: {
    blog: {
      title: 'ブログ',
      readMore: '続きを読む',
    },
  },
  en: {
    blog: {
      title: 'Blog',
      readMore: 'Read more',
    },
  },
}
```

---

## Performance Guidelines

### Image Optimization
- Use Next.js `<Image>` component
- Provide width and height
- Use appropriate formats (WebP preferred)

### Code Splitting
- Use dynamic imports for heavy components:
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
})
```

### Caching
- Use appropriate cache strategies in fetch
- Leverage Next.js static generation where possible

---

## Security

### Environment Variables
- Never commit secrets to git
- Use `.env.local` for local development
- Prefix public variables with `NEXT_PUBLIC_`

### API Security
- Validate all inputs
- Use appropriate authentication for protected routes
- Sanitize user-generated content
