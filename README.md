# Frontend For Dummies

A Next.js 16 App Router monorepo project that curates frontend challenges, interactive code practice, snippet-based quizzes, and educational blogs for JavaScript and React.

## What's Inside

- **Home** – Landing page with featured challenges  
- **Explore** – Search + category filters to browse every challenge  
- **Blogs** – Educational content and guides (`/blog`)  
- **Challenge Detail** – `/design/[slug]` with description, tags, demo/code links, and SEO metadata  
- **Practice IDE** – `/practice/[slug]` Monaco editor with resizable panes, console capture, reset, and optional editorial tab  
- **Snippet Quizzes** – `/snippet-practice/[slug]` run-the-code output predictions with MCQ answers and explanations  
- **Demos** – e.g. nested comments system demo at `/design/nested-comments-system/demo`  
- **Always-on dark theme**, structured JSON-LD per page, and loading states

## Tech Stack

- **Monorepo**: Turborepo for build orchestration and caching
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript  
- **Styling**: Tailwind CSS v4 (global tokens in `src/app/globals.css`, `tw-animate-css`, `tailwind-merge`)  
- **Editor**: Monaco editor, `react-markdown`, `react-syntax-highlighter`, `lucide-react`
- **Package Manager**: npm workspaces with Turborepo

## Monorepo Structure

This project uses a Turborepo monorepo setup:

```
frontendfordummies/
├── apps/
│   └── web/              # Next.js application
├── packages/
│   └── ui/               # Shared UI components (@repo/ui)
├── turbo.json            # Turborepo configuration
└── package.json          # Root package with workspaces
```

### Benefits

- **Shared Components**: Reusable UI components in `packages/ui`
- **Fast Builds**: Turborepo caching and parallel execution
- **Type Safety**: TypeScript paths for cross-package imports
- **Scalability**: Easy to add new apps or packages


## Key Routes

- `/` – Landing with featured challenges  
- `/explore` – Search + category filters  
- `/blog` – Blog listing page  
- `/blog/[slug]` – Individual blog post  
- `/design/[slug]` – Challenge detail page  
- `/practice/[slug]` – In-browser IDE for starter code + logs  
- `/snippet-practice/[slug]` – Output-prediction quizzes  
- `/playground` – JavaScript playground  
- `/design/nested-comments-system/demo` – Live demo example

## Project Structure

```
frontendfordummies/
├── apps/
│   └── web/
│       └── src/
│           ├── app/
│           │   ├── page.tsx              // home
│           │   ├── explore/              // browse challenges
│           │   ├── blog/                  // blog listing + detail
│           │   ├── design/[slug]/         // challenge detail + demo
│           │   ├── practice/[slug]/       // IDE experience
│           │   ├── snippet-practice/[slug]/ // snippet quizzes
│           │   ├── playground/            // JavaScript playground
│           │   └── globals.css            // Tailwind v4 + theme tokens
│           ├── components/
│           │   ├── TemplateCard.tsx
│           │   ├── AppShell.tsx
│           │   ├── Navbar.tsx, Footer.tsx
│           │   ├── design-detail/         // detail page building blocks
│           │   └── demos/                 // demo UI components
│           ├── data/
│           │   ├── snippets/*.ts         // quiz snippets
│           │   ├── markdown/*.ts          // long-form descriptions/editorials
│           │   ├── starter-code/*.ts      // IDE starter templates
│           │   └── editorial/*.ts       // solution writeups
│           ├── lib/
│           │   ├── constants.ts           // INITIAL_TEMPLATES seed data
│           │   └── challenges.ts          // lookup helpers
│           └── context/
│               └── AppContext.tsx         // template store + theme
└── packages/
    └── ui/
        └── src/
            ├── Button.tsx                 // Shared button component
            ├── Badge.tsx                  // Shared badge component
            └── index.ts                   // Package exports
```

## Content Model

Challenges and blogs are seeded in `apps/web/src/lib/constants.ts` as `Template` objects. A template can include:

- `starterCode` for the IDE route  
- `editorial` (markdown string) for the editorial tab  
- `snippets` array for output-prediction quizzes  
- `fullDescription` (markdown string) for blog posts or challenge descriptions
- metadata: `category`, `tags`, `techStack`, `goal`, `demoUrl`, `githubUrl`

### Categories

- **React** – React component challenges
- **JavaScript** – JavaScript coding challenges
- **Snippet Practice** – Output prediction quizzes
- **Blogs** – Educational content and guides (only visible in navbar)

Supporting content lives in:
- `apps/web/src/data/snippets/` – Quiz snippets
- `apps/web/src/data/markdown/` – Long-form descriptions/editorials/blogs
- `apps/web/src/data/starter-code/` – IDE starter templates
- `apps/web/src/data/editorial/` – Solution writeups

## Getting Started

### Prerequisites

- Node.js 20+

### Installation

```bash
git clone https://github.com/pratikkumar399/frontendfordummies.git
cd frontendfordummies
npm install
npm run dev
```

Visit `http://localhost:3000`.

### Development Commands

```bash
# Run all apps in development mode
npm run dev

# Build all packages and apps
npm run build

# Start production server
npm start

# Lint all packages
npm run lint

# Clean build artifacts
npm run clean
```

### Working with the Monorepo

- **Add a new app**: Create a new directory in `apps/` and add it to `package.json` workspaces
- **Add a new package**: Create a new directory in `packages/` and add it to `package.json` workspaces
- **Use shared UI**: Import from `@repo/ui` in any app (e.g., `import { Button } from '@repo/ui'`)
- **TypeScript paths**: Configure in `tsconfig.json` for cross-package imports

## Adding Content

### Adding a Challenge

1. Add a new entry to `apps/web/src/lib/constants.ts` (unique `id` and `slug`)
2. Set the `category` to one of: `Category.REACT`, `Category.JAVASCRIPT`, `Category.SNIPPET_PRACTICE`, etc.
3. If needed, place supporting content in:
   - **Snippets**: `apps/web/src/data/snippets/*.ts`
   - **Markdown/Editorial**: `apps/web/src/data/markdown/*.ts` or `apps/web/src/data/editorial/*.ts`
   - **Starter Code**: `apps/web/src/data/starter-code/*.ts`
4. Include `demoUrl` or add a demo route under `apps/web/src/app/design/[slug]/demo` if you provide one

### Adding a Blog Post

1. Create a markdown TypeScript file in `apps/web/src/data/markdown/` (e.g., `my-blog.ts`)
2. Export a constant with the markdown content: `export const MY_BLOG_MD = \`...\`;`
3. Import it in `apps/web/src/lib/constants.ts`
4. Add a new template entry with:
   - `category: Category.BLOGS`
   - `fullDescription: MY_BLOG_MD`
   - Unique `slug` for the blog post
5. The blog will automatically appear on `/blog` and be accessible at `/blog/[slug]`

## Features

### Responsive Design
- Mobile-first responsive navbar with icon-only buttons on small screens
- Adaptive layouts for all pages
- Touch-friendly interactions

### SEO & Performance
- Structured data (JSON-LD) on all pages for better search visibility
- Optimized images and lazy loading
- Fast builds with Turborepo caching

### Developer Experience
- Type-safe cross-package imports
- Shared UI components in `@repo/ui`
- Hot module replacement in development
- Consistent code style with ESLint

## Notes

- **Dark Mode**: Always-on dark theme via `AppContext`; no theme toggle required
- **SEO**: Structured data scripts exist on home, explore, blog, detail, practice, and quiz pages
- **Styling**: Tailwind v4 utilities live in `globals.css` with custom CSS variables for colors/radii
- **Monorepo**: Uses Turborepo for build orchestration - see `turbo.json` for task configuration
- **Categories**: Only categories with content are shown in the explore page sidebar


Made with ❤️ by [@pratikrai](https://github.com/pratikkumar399)

