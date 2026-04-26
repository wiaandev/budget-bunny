import Link from "next/link";
import { CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

const highlights = [
  {
    title: "Rule-driven planning",
    text: "Use the 50/20/15/15 split to stay grounded while still adapting to real life.",
    icon: CheckCircle2,
  },
  {
    title: "Debt with momentum",
    text: "Track principal progress and keep your payoff strategy visible every week.",
    icon: TrendingUp,
  },
  {
    title: "Reimbursements and offsets",
    text: "Capture shared costs and see true net spending without spreadsheet cleanup.",
    icon: ShieldCheck,
  },
];

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,hsl(var(--primary)/0.18),transparent_38%),radial-gradient(circle_at_85%_12%,hsl(160_20%_65%/0.28),transparent_32%),linear-gradient(160deg,hsl(var(--background)),hsl(45_30%_96%))]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,hsl(var(--foreground)/0.04)_38%,transparent_70%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="float-in flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
            BB
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Budget Bunny
            </p>
            <p className="text-sm font-semibold">Spend softer. Plan smarter.</p>
          </div>
        </Link>

        <div className="float-in-delayed flex items-center gap-2">
          {user ? (
            <Button asChild variant="secondary" className="rounded-full px-5">
              <Link href="/protected">Open Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="rounded-full px-5">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild className="rounded-full px-5">
                <Link href="/auth/sign-up">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-10 px-6 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:pt-12">
        <div className="float-in-delayed space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Personal budget cockpit
          </div>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-[-0.03em] md:text-6xl">
              Money clarity that feels
              <span className="text-primary"> calm</span>, not chaotic.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground md:text-lg">
              Budget Bunny helps you structure spending, track debt payoff, and
              absorb reimbursements without friction. The dashboard is available
              after sign in, so your numbers stay private.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href={user ? "/protected" : "/auth/sign-up"}>
                {user ? "Go to dashboard" : "Start free"}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-7">
              <Link href="/auth/login">I already have an account</Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-border/70 bg-card/85 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">50 / 20 / 15 / 15</p>
              <p className="text-sm text-muted-foreground">Live rule tracking</p>
            </article>
            <article className="rounded-2xl border border-border/70 bg-card/85 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Net-aware</p>
              <p className="text-sm text-muted-foreground">Reimbursement offsets</p>
            </article>
            <article className="rounded-2xl border border-border/70 bg-card/85 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Private</p>
              <p className="text-sm text-muted-foreground">Dashboard behind auth</p>
            </article>
          </div>
        </div>

        <div className="float-in space-y-4 rounded-3xl border border-border/75 bg-card/90 p-4 shadow-[0_20px_70px_-30px_hsl(var(--foreground)/0.35)] backdrop-blur md:p-6">
          <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium">Monthly Snapshot</p>
              <p className="text-xs text-muted-foreground">April</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Needs</span>
                  <span>48%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 w-[48%] rounded-full bg-primary" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Debt payoff</span>
                  <span>17%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 w-[17%] rounded-full bg-emerald-600" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Future planning</span>
                  <span>35%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className="h-2 w-[35%] rounded-full bg-amber-600" />
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-secondary/70 p-3">
                <p className="text-xs text-muted-foreground">Net spending</p>
                <p className="text-base font-semibold">R 13,420</p>
              </div>
              <div className="rounded-xl bg-secondary/70 p-3">
                <p className="text-xs text-muted-foreground">Recovered</p>
                <p className="text-base font-semibold text-primary">R 1,880</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/80 p-5">
            <p className="mb-3 text-sm font-medium">Why people stick with it</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              {highlights.map(({ title, text, icon: Icon }) => (
                <div key={title} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>
                    <span className="font-medium text-foreground">{title}: </span>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60 bg-background/70">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-5 text-sm text-muted-foreground md:px-10">
          <p>Budget Bunny</p>
          <p>Dashboard access requires authentication.</p>
        </div>
      </footer>
    </main>
  );
}
