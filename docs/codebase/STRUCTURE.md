# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path | Purpose | Evidence |
|------|---------|----------|
| app/ | Next.js App Router routes, layouts, and route handlers | app/layout.tsx, app/page.tsx, app/auth/confirm/route.ts |
| components/ | Reusable UI and feature components (auth forms, tutorial, shadcn-based UI primitives) | components/login-form.tsx, components/ui/button.tsx |
| lib/ | Shared utilities and Supabase client wrappers | lib/utils.ts, lib/supabase/server.ts |
| docs/codebase/ | Generated codebase knowledge documentation | docs/codebase/STACK.md |
| .agents/skills/ | Local agent skill assets/scripts (repo tooling) | .agents/skills/acquire-codebase-knowledge/SKILL.md |
| .github/ | Present but currently empty | .github/ directory listing |
| proxy.ts | Next.js proxy entry that applies session update middleware logic | proxy.ts |
| package.json | Dependency and script manifest | package.json |
| tsconfig.json | TypeScript compiler configuration and path aliasing | tsconfig.json |

### 2) Entry Points

- Main runtime entry: app/layout.tsx + app/page.tsx under Next.js App Router
- Secondary entry points (worker/cli/jobs): proxy.ts and app/auth/confirm/route.ts
- How entry is selected (script/config): npm scripts invoke Next runtime (dev/build/start), and proxy matcher config controls middleware coverage

### 3) Module Boundaries

| Boundary | What belongs here | What must not be here |
|----------|-------------------|------------------------|
| app/ routes/layouts | Page composition, route handlers, route-level guards and redirects | Shared low-level client construction logic |
| components/ | UI composition and interaction handlers | Global routing/middleware policy |
| lib/supabase/ | Supabase client factory logic for browser/server/proxy contexts | UI rendering |
| lib/utils.ts | Shared helpers and simple environment checks | Route-specific business flow |
| components/ui/ | Primitive reusable UI elements | Auth/session orchestration |

### 4) Naming and Organization Rules

- File naming pattern: kebab-case for multiword files (sign-up-form.tsx, forgot-password-form.tsx); route folders also kebab-case (sign-up-success)
- Directory organization pattern: primarily feature-oriented under app/ and components/, with an integration-focused utility layer under lib/supabase/
- Import aliasing or path conventions: TypeScript alias @/* maps to project root; imports commonly use @/components and @/lib

### 5) Evidence

- package.json
- tsconfig.json
- proxy.ts
- app/layout.tsx
- app/page.tsx
- app/auth/confirm/route.ts
- components/login-form.tsx
- lib/supabase/server.ts
