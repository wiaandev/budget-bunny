"use client";

import { Button } from "@/components/ui/button";
import { useLedger } from "@/components/ledger/ledger-provider";

export default function NewBudgetSetupPage() {
  const { startFresh, reuseLastMonth } = useLedger();

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">New Budget Setup</h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Start Fresh</h3>
          <p className="mt-2 text-sm text-[#5f6558]">Clear this month and begin from a clean budget.</p>
          <Button onClick={startFresh} className="mt-4 rounded-full bg-[#536346] text-white hover:bg-[#445537]">
            Start Fresh
          </Button>
        </article>

        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Reuse Last Month</h3>
          <p className="mt-2 text-sm text-[#5f6558]">Carry over categories and recurring items with payment states reset.</p>
          <Button onClick={reuseLastMonth} className="mt-4 rounded-full bg-[#536346] text-white hover:bg-[#445537]">
            Reuse Last Month
          </Button>
        </article>
      </div>

    </section>
  );
}
