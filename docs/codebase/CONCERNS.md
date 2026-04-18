# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested action |
|----------|---------|----------|--------|------------------|
| high | No automated tests configured | package.json has no test scripts; no test files detected | Regressions in auth/session/data flows likely to reach production unnoticed | Add baseline unit/integration test stack and CI execution |
| medium | Error details are reflected into UI query string on auth error route | app/auth/confirm/route.ts redirects with error message; app/auth/error/page.tsx renders params.error | Potential information disclosure of backend/library messages | Map internal errors to safe user-facing codes/messages |
| medium | Budgets query page logs raw data and lacks explicit error handling path | app/protected/budgets/page.tsx | Risk of sensitive data exposure in logs and brittle failure behavior | Handle { error } explicitly and remove or sanitize logging |
| low | Runtime version pinning is absent | package.json lacks engines; no .nvmrc observed | Team/dev/prod Node drift can create inconsistent behavior | Add Node version pinning strategy (engines or .nvmrc) |

### 2) Technical Debt

| Debt item | Why it exists | Where | Risk if ignored | Suggested fix |
|-----------|---------------|-------|-----------------|---------------|
| Starter-template tutorial code still present in core UI | Repository appears based on starter kit with tutorial/deploy helpers | components/tutorial/*, app/page.tsx, app/protected/layout.tsx | Product UX/code complexity may diverge from actual domain intent | [ASK USER] Decide which starter/tutorial components remain in target product |
| Auth guard logic duplicated across middleware and page-level checks | Middleware and protected page both verify auth | lib/supabase/proxy.ts, app/protected/page.tsx | Future changes may update one path but not the other | Consolidate policy and document guard responsibilities |
| Direct data access in route component | Query logic currently in page component | app/protected/budgets/page.tsx | Harder to test/reuse/validate data access behavior | Introduce domain/data access module for budgets |

### 3) Security Concerns

| Risk | OWASP category (if applicable) | Evidence | Current mitigation | Gap |
|------|--------------------------------|----------|--------------------|-----|
| Error message reflection into client-visible page | A01/A09 (access/control + logging/monitoring context dependent) | app/auth/confirm/route.ts, app/auth/error/page.tsx | Error route exists and centralizes display | No sanitization or error-code mapping observed |
| Logging potentially sensitive data from protected query | A09 Security Logging and Monitoring Failures (handling context) | app/protected/budgets/page.tsx | Protected route context exists | No explicit redaction/structured logging policy |
| Public env var usage is correct for publishable key but secret-key patterns are undocumented | N/A | lib/supabase/client.ts, lib/supabase/server.ts | Uses publishable key variable name in code | [TODO] No documented policy describing allowed env var classes in this repo |

### 4) Performance and Scaling Concerns

| Concern | Evidence | Current symptom | Scaling risk | Suggested improvement |
|---------|----------|-----------------|-------------|-----------------------|
| Repeated auth claim checks across middleware and page may add overhead | lib/supabase/proxy.ts, app/protected/page.tsx | Duplicate calls on protected navigation paths | Increased latency and redundant external auth work | Define one canonical guard path per request type |
| No query pagination/filtering shown for budgets fetch | app/protected/budgets/page.tsx selects all columns and rows | Potentially large payloads serialized to UI | Larger datasets can degrade response time and memory use | Add bounded queries and explicit projection/pagination |
| No observable retry/timeout control for external calls | Supabase calls in forms/pages without timeout/retry wrappers | Failures depend on default SDK behavior | Harder to tune reliability under transient failures | Add integration wrapper with explicit timeout/retry decisions |

### 5) Fragile/High-Churn Areas

| Area | Why fragile | Churn signal | Safe change strategy |
|------|-------------|-------------|----------------------|
| app/auth/* and app/protected/* routes | Auth redirects/session flow are correctness-critical | Current git history is shallow (single init commit), so change-risk cannot be estimated from churn yet | Make small changes with end-to-end auth flow verification |
| lib/supabase/proxy.ts | Cookie sync/session logic has strict ordering constraints (noted by inline comments) | Central integration file for every matched request | Keep behavior-preserving refactors and add tests first |
| app/protected/budgets/page.tsx | Early-stage data path with visible debugging artifacts | New feature-like path with direct DB query | Introduce explicit error/loading handling before feature expansion |

### 6) [ASK USER] Questions

1. [ASK USER] Should starter/tutorial/deploy helper content remain as product-facing functionality, or should docs and code treat this as a temporary scaffold?
2. [ASK USER] What minimum automated test bar is required before adding more domain features (unit only, integration auth flow, or full e2e)?
3. [ASK USER] Should raw backend/SDK error messages ever be shown to users, or should we enforce mapped generic messages only?

### 7) Evidence

- package.json
- app/auth/confirm/route.ts
- app/auth/error/page.tsx
- app/protected/page.tsx
- app/protected/budgets/page.tsx
- lib/supabase/proxy.ts
- app/page.tsx
- app/protected/layout.tsx
- components/tutorial/sign-up-user-steps.tsx
- git recent commits output (single commit: chore: init)
