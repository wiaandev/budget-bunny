# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area | Value | Evidence |
|------|-------|----------|
| Primary language | TypeScript (TS + TSX) | package.json, tsconfig.json |
| Runtime + version | Node.js runtime for Next.js app; exact Node version is [TODO] (no .nvmrc/engines field found) | package.json |
| Package manager | npm (lockfile v3 present) | package-lock.json |
| Module/build system | Next.js build/runtime with TypeScript moduleResolution=bundler | package.json, tsconfig.json |

### 2) Production Frameworks and Dependencies

| Dependency | Version | Role in system | Evidence |
|------------|---------|----------------|----------|
| next | latest | Web framework and App Router runtime | package.json |
| react / react-dom | ^19.0.0 | UI rendering and component model | package.json |
| @supabase/ssr | latest | Supabase client setup for server/browser with cookie-based auth session support | package.json, lib/supabase/server.ts, lib/supabase/client.ts |
| @supabase/supabase-js | latest | Supabase auth/data SDK usage (auth + table queries) | package.json, app/protected/budgets/page.tsx |
| next-themes | ^0.4.6 | Theme switching support | package.json, app/layout.tsx |
| @radix-ui/* | ^1.x / ^2.x | Headless UI primitives used by local UI components | package.json, components/ui/dropdown-menu.tsx |
| class-variance-authority / clsx / tailwind-merge | ^0.7.1 / ^2.1.1 / ^3.3.0 | Utility layer for class composition and style variants | package.json, lib/utils.ts |
| lucide-react | ^0.511.0 | Icon library | package.json, app/protected/page.tsx |

### 3) Development Toolchain

| Tool | Purpose | Evidence |
|------|---------|----------|
| TypeScript | Static typing and transpilation checks (noEmit) | package.json, tsconfig.json |
| ESLint + eslint-config-next | Linting (Next core-web-vitals + TypeScript config) | package.json, eslint.config.mjs |
| Tailwind CSS + PostCSS + autoprefixer | Utility CSS and CSS transform pipeline | package.json, tailwind.config.ts, postcss.config.mjs |
| tailwindcss-animate | Tailwind plugin for animation utilities | package.json, tailwind.config.ts |

### 4) Key Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

### 5) Environment and Config

- Config sources: package.json, tsconfig.json, eslint.config.mjs, next.config.ts, tailwind.config.ts, postcss.config.mjs, components.json, .env.local
- Required env vars (observed in code): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- Additional env vars consumed for deployment-aware UI/metadata: VERCEL_URL, VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL
- Deployment/runtime constraints: App behavior depends on Supabase env vars; missing vars trigger warning/limited auth behavior through hasEnvVars checks

### 6) Evidence

- package.json
- package-lock.json
- tsconfig.json
- eslint.config.mjs
- next.config.ts
- tailwind.config.ts
- postcss.config.mjs
- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/supabase/proxy.ts
- lib/utils.ts
- app/layout.tsx
- components/tutorial/sign-up-user-steps.tsx
