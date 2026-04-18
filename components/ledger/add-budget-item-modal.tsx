"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLedger } from "./ledger-provider";
import type { Bucket } from "./ledger-types";

const bucketOptions: Array<{ value: Bucket; label: string }> = [
  { value: "needs", label: "Needs (50%)" },
  { value: "investments", label: "Investments (20%)" },
  { value: "wants", label: "Wants (15%)" },
  { value: "emergency", label: "Emergency (15%)" },
];

export function AddBudgetItemModal() {
  const { addBudgetItem, collaborators, debtProgress, budgetItemsWithNet } =
    useLedger();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [entryType, setEntryType] = useState<"expense" | "reimbursement">(
    "expense",
  );
  const [bucket, setBucket] = useState<Bucket>("needs");
  const [ownerId, setOwnerId] = useState(collaborators[0]?.id ?? "");
  const [debtId, setDebtId] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [linkedExpenseId, setLinkedExpenseId] = useState("");
  const [offsetAmount, setOffsetAmount] = useState("");
  const [recurring, setRecurring] = useState(false);

  const expenseOptions = budgetItemsWithNet.filter(
    (item) => item.entryType === "expense",
  );

  const netPreview =
    entryType === "expense"
      ? Number(amount || 0) - Number(offsetAmount || 0)
      : -Number(amount || 0);

  const canSubmit = useMemo(
    () => name.trim().length > 1 && Number(amount) > 0,
    [amount, name],
  );

  const reset = () => {
    setName("");
    setAmount("");
    setEntryType("expense");
    setBucket("needs");
    setDebtId("");
    setCounterparty("");
    setLinkedExpenseId("");
    setOffsetAmount("");
    setRecurring(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full bg-[#536346] text-white hover:bg-[#445537]">
        Add Budget Item
      </Button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#1a1c1c]/20 px-4 py-6 backdrop-blur-sm md:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Screen 11</p>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Add Budget Item</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget-item-name">Name</Label>
                <Input
                  id="budget-item-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Medical Aid"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
              </div>

              <div className="space-y-2">
                <Label>Type</Label>
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#f4f3f2] p-1">
                  <button
                    type="button"
                    onClick={() => setEntryType("expense")}
                    className={`rounded-lg px-3 py-2 text-sm ${entryType === "expense" ? "bg-white text-[#1a1c1c]" : "text-[#5f6558]"}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEntryType("reimbursement");
                      setLinkedExpenseId("");
                      setOffsetAmount("");
                    }}
                    className={`rounded-lg px-3 py-2 text-sm ${entryType === "reimbursement" ? "bg-white text-[#1a1c1c]" : "text-[#5f6558]"}`}
                  >
                    Reimbursement
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-item-amount">Amount</Label>
                <Input
                  id="budget-item-amount"
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
              </div>

              {entryType === "expense" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="budget-item-counterparty">Counterparty (Optional)</Label>
                    <Input
                      id="budget-item-counterparty"
                      value={counterparty}
                      onChange={(event) => setCounterparty(event.target.value)}
                      placeholder="Jane"
                      className="rounded-xl border-0 bg-[#f4f3f2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget-item-linked-expense">Link To Existing Expense (Offset)</Label>
                    <select
                      id="budget-item-linked-expense"
                      value={linkedExpenseId}
                      onChange={(event) => {
                        const value = event.target.value;
                        setLinkedExpenseId(value);
                        if (!value) {
                          setOffsetAmount("");
                          return;
                        }
                        const linked = expenseOptions.find((item) => item.id === value);
                        setOffsetAmount(String(linked?.amount ?? 0));
                      }}
                      className="h-10 w-full rounded-xl border-0 bg-[#f4f3f2] px-3 text-sm"
                    >
                      <option value="">No linked expense</option>
                      {expenseOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {linkedExpenseId ? (
                    <div className="space-y-2">
                      <Label htmlFor="budget-item-offset">Offset Amount</Label>
                      <Input
                        id="budget-item-offset"
                        type="number"
                        min={0}
                        value={offsetAmount}
                        onChange={(event) => setOffsetAmount(event.target.value)}
                        className="rounded-xl border-0 bg-[#f4f3f2]"
                      />
                    </div>
                  ) : null}
                </>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="budget-item-bucket">Category</Label>
                <select
                  id="budget-item-bucket"
                  value={bucket}
                  onChange={(event) => setBucket(event.target.value as Bucket)}
                  className="h-10 w-full rounded-xl border-0 bg-[#f4f3f2] px-3 text-sm"
                >
                  {bucketOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-item-owner">Owner</Label>
                <select
                  id="budget-item-owner"
                  value={ownerId}
                  onChange={(event) => setOwnerId(event.target.value)}
                  className="h-10 w-full rounded-xl border-0 bg-[#f4f3f2] px-3 text-sm"
                >
                  {collaborators.map((collaborator) => (
                    <option key={collaborator.id} value={collaborator.id}>
                      {collaborator.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-item-debt">Linked Debt (Optional)</Label>
                <select
                  id="budget-item-debt"
                  value={debtId}
                  onChange={(event) => setDebtId(event.target.value)}
                  className="h-10 w-full rounded-xl border-0 bg-[#f4f3f2] px-3 text-sm"
                >
                  <option value="">Not debt related</option>
                  {debtProgress.map((debt) => (
                    <option key={debt.id} value={debt.id}>
                      {debt.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-3 text-sm text-[#5f6558]">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(event) => setRecurring(event.target.checked)}
                  className="h-4 w-4 rounded border-[#c5c8bd]"
                />
                Recurring item
              </label>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <p className="mr-auto text-xs text-[#5f6558]">
                Net {netPreview >= 0 ? "expense" : "credit"}: {Math.abs(netPreview).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={!canSubmit}
                onClick={() => {
                  addBudgetItem({
                    name: name.trim(),
                    amount: Number(amount),
                    bucket,
                    entryType,
                    recurring,
                    ownerId,
                    debtId: debtId || undefined,
                    linkedExpenseId: linkedExpenseId || undefined,
                    offsetAmount: offsetAmount ? Number(offsetAmount) : undefined,
                    counterparty: counterparty.trim() || undefined,
                  });
                  setOpen(false);
                  reset();
                }}
                className="rounded-full bg-[#536346] text-white hover:bg-[#445537]"
              >
                Save Item
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
