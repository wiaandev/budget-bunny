# Architecture

## Core Sections (Required)

### 1) Architectural Style

- Primary style: Next.js App Router with feature-oriented route modules and adapter-style integration layer for Supabase
- Why this classification: route files in app/ own request/page entry, while lib/supabase/* encapsulates client wiring for browser/server/proxy contexts
- Primary constraints:
  - Auth/session correctness relies on proxy/session update flow and cookie synchronization
  - Protected routes depend on Supabase claim checks + redirects
  - Behavior is environment-variable gated (hasEnvVars) for auth-dependent UX

### 2) System Flow

```text
HTTP request -> Next.js route/proxy -> Supabase session/claims check -> route/page logic -> rendered response or redirect
```

Observed flow (auth-protected request path):
1. Request passes through proxy.ts, which delegates to updateSession in lib/supabase/proxy.ts.
2. updateSession creates a request-scoped Supabase server client with request/response cookie bridging.
3. updateSession calls supabase.auth.getClaims() and redirects unauthenticated users (except allowed routes) to /auth/login.
4. Protected pages (for example app/protected/page.tsx) also call server-side createClient() and perform auth.getClaims() checks.
5. Route handlers like app/auth/confirm/route.ts verify OTP and redirect to success/error targets.
6. Client-side auth forms in components/ call browser createClient() and run auth operations (sign-in/sign-up/reset/update).

### 3) Layer/Module Responsibilities

| Layer or module | Owns | Must not own | Evidence |
|-----------------|------|--------------|----------|
| app/* routes/layouts | Route/page rendering, route handlers, top-level redirects | Low-level client setup details | app/page.tsx, app/protected/page.tsx, app/auth/confirm/route.ts |
| lib/supabase/* | Context-specific Supabase client creation and session update behavior | View rendering and component-level UI state | lib/supabase/client.ts, lib/supabase/server.ts, lib/supabase/proxy.ts |
| components/* | Reusable UI and client interaction handlers (forms/buttons) | Global middleware policy | components/login-form.tsx, components/sign-up-form.tsx |
| proxy.ts | Framework integration point to execute request-time session updates | Page-level presentation concerns | proxy.ts |

### 4) Reused Patterns

| Pattern | Where found | Why it exists |
|---------|-------------|---------------|
| Adapter/wrapper around external SDK | lib/supabase/client.ts, lib/supabase/server.ts, lib/supabase/proxy.ts | Isolates context-specific Supabase setup and cookie handling |
| Guard + redirect authorization pattern | lib/supabase/proxy.ts, app/protected/page.tsx | Prevents unauthenticated access to protected routes |
| Environment-gated feature checks | lib/utils.ts, app/page.tsx, app/protected/layout.tsx | Allows starter template to run with partial setup while signaling missing config |

### 5) Known Architectural Risks

- Auth checks are duplicated between proxy middleware and protected page logic, which may increase divergence risk over time.
- Data access in app/protected/budgets/page.tsx currently performs direct table query and console logging without explicit error handling.

### 6) Evidence

- proxy.ts
- lib/supabase/proxy.ts
- lib/supabase/server.ts
- lib/supabase/client.ts
- lib/utils.ts
- app/protected/page.tsx
- app/protected/budgets/page.tsx
- app/auth/confirm/route.ts
- components/login-form.tsx
- components/sign-up-form.tsx
