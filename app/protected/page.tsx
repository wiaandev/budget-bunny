"use client";

import { AddBudgetItemModal } from "@/components/modal/add-budget-item-modal";
import {
  BucketProgress,
  StatCard,
  formatCurrency,
} from "@/components/ledger-primitives";
import { useLedger } from "@/components/ledger-provider";

const bucketTitles = {
  needs: "Needs 50%",
  investments: "Investments 20%",
  wants: "Wants 15%",
  emergency: "Emergency 15%",
} as const;

export default function ProtectedPage() {
  const {
    availableToAllocate,
    leftoverBalance,
    totalIncome,
    reimbursementTotal,
    bucketTotals,
    bucketTargets,
    warnings,
    budgetItemsWithNet,
  } = useLedger();

  const recentMovements = budgetItemsWithNet
    .filter((item) => item.paid)
    .sort((a, b) => (b.paidAt ?? "").localeCompare(a.paidAt ?? ""))
    .slice(0, 5);

  const warningCount = Object.values(warnings).filter((level) => level !== "ok").length;

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Dashboard</h2>
          <p className="mt-2 text-sm text-[#5f6558]">
            Allocation confidence across the 50/20/15/15 system.
          </p>
        </div>
        <AddBudgetItemModal />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Available to Allocate"
          value={availableToAllocate}
          helper={warningCount > 0 ? `${warningCount} threshold warning(s) active` : "All categories within healthy thresholds"}
          emphasize
        />
        <StatCard label="Leftover" value={leftoverBalance} helper="Updated instantly from paid checkboxes" />
        <StatCard
          label="Monthly Income"
          value={totalIncome}
          helper={`Reimbursements this cycle: ${formatCurrency(reimbursementTotal)}`}
        />
      </div>

      <div className="space-y-3">
        <BucketProgress
          label={bucketTitles.needs}
          spent={bucketTotals.needs}
          target={bucketTargets.needs}
          status={warnings.needs}
        />
        <BucketProgress
          label={bucketTitles.investments}
          spent={bucketTotals.investments}
          target={bucketTargets.investments}
          status={warnings.investments}
        />
        <BucketProgress
          label={bucketTitles.wants}
          spent={bucketTotals.wants}
          target={bucketTargets.wants}
          status={warnings.wants}
        />
        <BucketProgress
          label={bucketTitles.emergency}
          spent={bucketTotals.emergency}
          target={bucketTargets.emergency}
          status={warnings.emergency}
        />
      </div>

      <article className="rounded-2xl bg-white p-5">
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Recent Movements</h3>
        <div className="mt-4 space-y-3">
          {recentMovements.length === 0 ? (
            <p className="text-sm text-[#5f6558]">No paid movements yet this month.</p>
          ) : (
            recentMovements.map((movement) => (
              <div key={movement.id} className="flex items-center justify-between rounded-xl bg-[#f4f3f2] p-3">
                <div>
                  <p className="text-sm font-medium text-[#1a1c1c]">{movement.name}</p>
                  <p className="text-xs text-[#5f6558]">
                    {movement.paidAt ? new Date(movement.paidAt).toLocaleDateString() : "No date"}
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-[#1a1c1c]">
                  {formatCurrency(movement.effectiveAmount)}
                </p>
              </div>
            ))
          )}
        </div>
      </article>
      <div className="rounded-2xl bg-[#fff1d6] p-4 text-sm text-[#995500]">
        Proactive warnings appear in amber and red whenever bucket allocations exceed their 50/20/15/15 targets.
      </div>
    </section>
  );
}
