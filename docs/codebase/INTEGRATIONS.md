# External Integrations

## Core Sections (Required)

### 1) Integration Inventory

| System | Type (API/DB/Queue/etc) | Purpose | Auth model | Criticality | Evidence |
|--------|---------------------------|---------|------------|-------------|----------|
| Supabase Auth | Auth service (external API via SDK) | Sign-in, sign-up, password reset/update, OTP verification, claim retrieval | Supabase JWT/session cookies handled by @supabase/ssr clients | High | components/login-form.tsx, components/sign-up-form.tsx, components/forgot-password-form.tsx, components/update-password-form.tsx, app/auth/confirm/route.ts |
| Supabase Postgres table access (Budget) | Database access via Supabase JS client | Fetch budget data for protected budgets page | Supabase client credentials from NEXT_PUBLIC_* env vars and user session context | Medium | app/protected/budgets/page.tsx, lib/supabase/server.ts |
| Vercel deployment metadata envs | Platform env integration | Dynamic metadataBase/default URL and tutorial guidance | Environment variables injected by host runtime | Low | app/layout.tsx, components/tutorial/sign-up-user-steps.tsx |

### 2) Data Stores

| Store | Role | Access layer | Key risk | Evidence |
|-------|------|--------------|----------|----------|
| Supabase-managed relational data (observed table: Budget) | Application data retrieval in protected route | app/protected/budgets/page.tsx via lib/supabase/server.ts createClient() | Limited error handling and inline query logic in route component | app/protected/budgets/page.tsx, lib/supabase/server.ts |
| Supabase auth/session cookies | Session continuity and auth context | lib/supabase/proxy.ts and lib/supabase/server.ts cookie adapters | Cookie sync mistakes can cause random logout/session drift (noted in code comments) | lib/supabase/proxy.ts, lib/supabase/server.ts |

### 3) Secrets and Credentials Handling

- Credential sources: Environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, Vercel envs)
- Hardcoding checks: No hardcoded Supabase credentials detected in source reviewed; env vars are read through process.env
- Rotation or lifecycle notes: [TODO] No explicit credential rotation/runbook docs found in repository

### 4) Reliability and Failure Behavior

- Retry/backoff behavior: None observed for Supabase calls in current code
- Timeout policy: [TODO] No explicit timeout configuration observed
- Circuit-breaker or fallback behavior: None observed; fallback UX exists only for missing env vars (warning + limited flow)

### 5) Observability for Integrations

- Logging around external calls: Minimal; one console.log of query result in budgets page
- Metrics/tracing coverage: None observed in repository
- Missing visibility gaps: No structured logs, no integration-level metrics/tracing, no explicit alerting config

### 6) Evidence

- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/supabase/proxy.ts
- lib/utils.ts
- components/login-form.tsx
- components/sign-up-form.tsx
- components/forgot-password-form.tsx
- components/update-password-form.tsx
- app/auth/confirm/route.ts
- app/protected/budgets/page.tsx
- app/layout.tsx
- components/tutorial/sign-up-user-steps.tsx
- .gitignore
