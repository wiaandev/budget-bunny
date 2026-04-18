"use client";

import { useMemo } from "react";
import { useLedger } from "@/components/ledger/ledger-provider";
import { formatCurrency } from "@/components/ledger/ledger-primitives";

const bucketLabel = {
  needs: "Needs",
  investments: "Investments",
  wants: "Wants",
  emergency: "Emergency",
};

export default function TransactionsPage() {
  const { budgetItemsWithNet, spendingVelocity } = useLedger();

  const movements = useMemo(
    () =>
      budgetItemsWithNet
        .filter((item) => item.paid)
        .sort((a, b) => (b.paidAt ?? "").localeCompare(a.paidAt ?? "")),
    [budgetItemsWithNet],
  );

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Transaction History</h2>
        </div>
        <p className="rounded-full bg-[#edf2e8] px-4 py-2 text-sm text-[#536346]">
          Spending velocity {formatCurrency(spendingVelocity)} / day
        </p>
      </header>

      <div className="space-y-3">
        {movements.length === 0 ? (
          <article className="rounded-2xl bg-white p-5 text-sm text-[#5f6558]">No paid transactions yet.</article>
        ) : (
          movements.map((movement) => (
            <article key={movement.id} className="rounded-2xl bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-medium text-[#1a1c1c]">{movement.name}</h3>
                  <p className="text-sm text-[#5f6558]">
                    {movement.paidAt ? new Date(movement.paidAt).toLocaleDateString() : "Pending date"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold tabular-nums text-[#1a1c1c]">
                    {formatCurrency(movement.effectiveAmount)}
                  </p>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#76806a]">{bucketLabel[movement.bucket]}</p>
                  {movement.entryType === "reimbursement" || movement.effectiveAmount < 0 ? (
                    <p className="text-[11px] uppercase tracking-[0.08em] text-[#536346]">Reimbursement</p>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
