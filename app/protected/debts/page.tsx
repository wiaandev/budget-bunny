"use client";

import { useLedger } from "@/components/ledger/ledger-provider";
import { AddBudgetItemModal } from "@/components/ledger/add-budget-item-modal";
import { formatCurrency } from "@/components/ledger/ledger-primitives";
import { AddDebtItemModal } from '@/components/ledger/add-debt-item-modal';

function interestSeverity(rate: number) {
  if (rate >= 15) return "text-[#ba1a1a] bg-[#ffdad6]";
  if (rate >= 10) return "text-[#995500] bg-[#fff1d6]";
  return "text-[#536346] bg-[#edf2e8]";
}

export default function DebtSnowballPage() {
  const { debtProgress } = useLedger();

  const totalDebt = debtProgress.reduce((sum, debt) => sum + debt.remainingPrincipal, 0);
  const paidTowardDebt = debtProgress.reduce((sum, debt) => sum + debt.paidTowardDebt, 0);
  const snowballVelocity = paidTowardDebt / Math.max(debtProgress.length, 1);
  const interestAvoided = paidTowardDebt * 0.12;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Debt & Snowball Tracker</h2>
          <p className="mt-2 text-sm text-[#5f6558]">Payments marked paid in the budget immediately reduce debt principal here.</p>
        </div>
        <AddDebtItemModal />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Outstanding Principal</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.02em]">{formatCurrency(totalDebt)}</p>
        </article>
        <article className="rounded-2xl bg-white p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Snowball Velocity</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.02em]">{formatCurrency(snowballVelocity)}</p>
        </article>
        <article className="rounded-2xl bg-white p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Estimated Interest Avoided</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#536346]">{formatCurrency(interestAvoided)}</p>
        </article>
      </div>

      <div className="space-y-3">
        {debtProgress.map((debt) => {
          const paidRatio = debt.principal === 0 ? 0 : (debt.paidTowardDebt / debt.principal) * 100;
          return (
            <article key={debt.id} className="rounded-2xl bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.01em]">{debt.name}</h3>
                  <p className="text-sm text-[#5f6558]">
                    Remaining {formatCurrency(debt.remainingPrincipal)} of {formatCurrency(debt.principal)}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.08em] ${interestSeverity(debt.interestRate)}`}>
                  {debt.interestRate}% APR {debt.interestRate >= 15 ? "Critical Rate" : "Tracked"}
                </span>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-[#e3e2e1]">
                <div className="h-1.5 rounded-full bg-[#536346]" style={{ width: `${Math.min(100, paidRatio)}%` }} />
              </div>
              <p className="mt-3 text-sm text-[#5f6558]">
                Minimum payment {formatCurrency(debt.minimumPayment)} · Paid this cycle {formatCurrency(debt.paidTowardDebt)}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
