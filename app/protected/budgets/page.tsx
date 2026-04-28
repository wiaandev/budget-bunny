"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddBudgetItemModal } from "@/components/modal/add-budget-item-modal";
import {
  Sparkline,
  formatCurrency,
} from "@/components/ledger-primitives";
import { useLedger } from "@/components/ledger-provider";

const bucketName = {
  needs: "Needs",
  investments: "Investments",
  wants: "Wants",
  emergency: "Emergency",
} as const;

export default function BudgetsPage() {
  const {
    incomeStreams,
    budgetItemsWithNet,
    ohCrapFund,
    whatIfRaisePct,
    projectionCurve,
    projectedMonthlyIncome,
    leftoverBalance,
    updateBudgetItem,
    deleteBudgetItem,
    updateIncomeStream,
    updateOhCrapFund,
    updateWhatIfRaisePct,
    toggleBudgetPaid,
  } = useLedger();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const beginEdit = (itemId: string, name: string, amount: number) => {
    setEditingId(itemId);
    setEditName(name);
    setEditAmount(String(amount));
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditAmount("");
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Monthly Budget Planner</h2>
          <p className="mt-2 text-sm text-[#5f6558]">
            Paid checkboxes update Leftover instantly in the top app bar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddBudgetItemModal />
          <Button className="rounded-full bg-[#536346] text-white hover:bg-[#445537]">Finalize Budget</Button>
        </div>
      </header>

      <article className="rounded-2xl bg-white p-5">
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Income Streams</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {incomeStreams.map((stream) => (
            <label key={stream.id} className="space-y-1">
              <span className="text-xs uppercase tracking-[0.1em] text-[#76806a]">{stream.name}</span>
              <Input
                type="number"
                value={stream.amount}
                min={0}
                className="rounded-xl border-0 bg-[#f4f3f2]"
                onChange={(event) => updateIncomeStream(stream.id, Number(event.target.value || 0))}
              />
            </label>
          ))}
        </div>
      </article>

      <article className="rounded-2xl bg-white p-5">
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Budget Items</h3>
        <div className="mt-4 space-y-2">
          {budgetItemsWithNet.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f4f3f2] p-3">
                <div className="flex items-center gap-3">
                  <Checkbox checked={item.paid} onCheckedChange={() => toggleBudgetPaid(item.id)} />
                  <div>
                    {isEditing ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(event) => setEditName(event.target.value)}
                          className="h-8 w-44 rounded-lg border-0 bg-white"
                        />
                        <Input
                          type="number"
                          min={0}
                          value={editAmount}
                          onChange={(event) => setEditAmount(event.target.value)}
                          className="h-8 w-28 rounded-lg border-0 bg-white"
                        />
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-[#1a1c1c]">{item.name}</p>
                    )}
                    <p className="text-xs text-[#5f6558]">
                      {bucketName[item.bucket]} {item.recurring ? "· Recurring" : "· One-time"}
                    </p>
                    {item.linkedExpenseId || item.entryType === "reimbursement" ? (
                      <p className="text-xs text-[#536346]">
                        {item.entryType === "reimbursement"
                          ? "Reimbursement increases available allocation"
                          : `Offset applied${item.counterparty ? ` · ${item.counterparty}` : ""}`}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm tabular-nums text-[#5f6558]">Base {formatCurrency(item.amount)}</p>
                    <p className="text-sm font-semibold tabular-nums text-[#1a1c1c]">
                      Net {formatCurrency(item.effectiveAmount)}
                    </p>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        className="h-8 rounded-full bg-[#536346] text-white hover:bg-[#445537]"
                        onClick={() => {
                          if (!editName.trim() || Number(editAmount) <= 0) return;
                          updateBudgetItem(item.id, {
                            name: editName.trim(),
                            amount: Number(editAmount),
                          });
                          cancelEdit();
                        }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 rounded-full" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-full text-[#536346]"
                        onClick={() => beginEdit(item.id, item.name, item.amount)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 rounded-full text-[#ba1a1a]"
                        onClick={() => deleteBudgetItem(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Oh-Crap Fund</h3>
          <p className="mt-1 text-sm text-[#5f6558]">Dedicated contingency reserve for surprises.</p>
          <Input
            type="number"
            min={0}
            value={ohCrapFund}
            onChange={(event) => updateOhCrapFund(Number(event.target.value || 0))}
            className="mt-4 rounded-xl border-0 bg-[#f4f3f2]"
          />
          <p className="mt-3 text-sm text-[#536346]">Current Leftover: {formatCurrency(leftoverBalance)}</p>
        </article>

        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">What-If Scenario</h3>
          <p className="mt-1 text-sm text-[#5f6558]">Model salary increases and view projection momentum.</p>
          <label className="mt-4 block text-xs uppercase tracking-[0.1em] text-[#76806a]">
            Salary Increase: {whatIfRaisePct}%
          </label>
          <input
            type="range"
            min={0}
            max={40}
            value={whatIfRaisePct}
            onChange={(event) => updateWhatIfRaisePct(Number(event.target.value))}
            className="mt-2 w-full accent-[#536346]"
          />
          <p className="mt-2 text-sm text-[#536346]">Projected monthly income: {formatCurrency(projectedMonthlyIncome)}</p>
          <div className="mt-4">
            <Sparkline points={projectionCurve} />
          </div>
        </article>
      </div>
    </section>
  );
}
