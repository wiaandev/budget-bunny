# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item | Rule | Example | Evidence |
|------|------|---------|----------|
| Files | kebab-case for multiword TypeScript/TSX files | components/sign-up-form.tsx, app/auth/forgot-password/page.tsx | components/sign-up-form.tsx, app/auth/forgot-password/page.tsx |
| Functions/methods | camelCase for functions/handlers | handleLogin, handleSignUp, updateSession, createClient | components/login-form.tsx, components/sign-up-form.tsx, lib/supabase/proxy.ts |
| Types/interfaces | PascalCase for imported type names | NextRequest, EmailOtpType, Metadata | app/auth/confirm/route.ts, app/layout.tsx |
| Constants/env vars | UPPER_SNAKE_CASE env keys; local constants in camelCase | NEXT_PUBLIC_SUPABASE_URL, defaultUrl | lib/supabase/client.ts, app/layout.tsx |

### 2) Formatting and Linting

- Formatter: [TODO] No dedicated formatter config found (no Prettier config observed)
- Linter: ESLint using flat config extending next/core-web-vitals and next/typescript
- Most relevant enforced rules: Next core-web-vitals defaults, Next TypeScript defaults, general Next lint integration [TODO: enumerate exact enabled/overridden rules if team needs a rule catalog]
- Run commands: npm run lint

### 3) Import and Module Conventions

- Import grouping/order: No explicit custom grouping config found; imports generally place framework/external and local alias imports in readable blocks.
- Alias vs relative import policy: Alias imports via @/* are primary for project-local modules.
- Public exports/barrel policy: No barrel index pattern detected; modules are imported via direct file paths.

### 4) Error and Logging Conventions

- Error strategy by layer: Client forms catch errors and render user-facing messages; route/proxy paths often redirect on auth errors.
- Logging style and required context fields: No structured logger found; observed direct console.log usage in app/protected/budgets/page.tsx.
- Sensitive-data redaction rules: [TODO] No explicit redaction/PII logging policy found in repository config/docs.

### 5) Testing Conventions

- Test file naming/location rule: [TODO] No test files detected.
- Mocking strategy norm: [TODO] No test harness or mock utilities detected.
- Coverage expectation: [TODO] No coverage threshold/config detected.

### 6) Evidence

- eslint.config.mjs
- tsconfig.json
- package.json
- components/login-form.tsx
- components/sign-up-form.tsx
- app/auth/confirm/route.ts
- lib/supabase/proxy.ts
- app/protected/budgets/page.tsx
