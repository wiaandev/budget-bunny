"use client";

import { useLedger } from "@/components/ledger/ledger-provider";
import { formatCurrency } from "@/components/ledger/ledger-primitives";

export default function GoalsPage() {
  const { goals } = useLedger();

  const emergency = goals.find((goal) => goal.type === "emergency");
  const ambitions = goals.filter((goal) => goal.type === "ambition");

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Goals & Emergency Fund</h2>
      </header>

      {emergency ? (
        <article className="rounded-3xl bg-[#edf2e8] p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-[#536346]">Emergency Fund</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">
            {formatCurrency(emergency.current)} / {formatCurrency(emergency.target)}
          </p>
          <p className="mt-1 text-sm text-[#5f6558]">Target: 6 months of runway</p>
          <div className="mt-4 h-2 rounded-full bg-white/80">
            <div
              className="h-2 rounded-full bg-[#536346]"
              style={{ width: `${Math.min(100, (emergency.current / emergency.target) * 100)}%` }}
            />
          </div>
        </article>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {ambitions.map((goal) => {
          const progress = Math.min(100, (goal.current / goal.target) * 100);
          return (
            <article key={goal.id} className="rounded-2xl bg-white p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Active Ambition</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">{goal.name}</h3>
              <p className="mt-2 text-sm text-[#5f6558]">
                {formatCurrency(goal.current)} saved of {formatCurrency(goal.target)}
              </p>
              <div className="mt-4 h-1.5 rounded-full bg-[#e3e2e1]">
                <div className="h-1.5 rounded-full bg-[#536346]" style={{ width: `${progress}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
