"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddDebtItemModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [firstPaymentDate, setFirstPaymentDate] = useState("");
  const [lastPaymentDate, setLastPaymentDate] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [amountLeft, setAmountLeft] = useState("");

  const addDebtItem = () => {
    console.log("Adding debt item...");
  };

  const canSubmit = useMemo(
    () =>
      name.trim().length > 1 &&
      Number(amount) > 0 &&
      firstPaymentDate &&
      lastPaymentDate &&
      Number(interestRate) >= 0 &&
      Number(amountLeft) > 0,
    [amount, name, firstPaymentDate, lastPaymentDate, interestRate, amountLeft],
  );

  const reset = () => {
    setName("");
    setAmount("");
    setFirstPaymentDate("");
    setLastPaymentDate("");
    setInterestRate("");
    setAmountLeft("");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="rounded-full bg-[#536346] text-white hover:bg-[#445537]">
        Add Debt Item
      </Button>

      {open ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#1a1c1c]/20 px-4 py-6 backdrop-blur-sm md:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6">
            <div className="mb-4">
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Add Debt Item</h3>
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
                <Label htmlFor="budget-item-amount">Total Debt Amount</Label>
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

              <div className="space-y-2">
                <Label htmlFor="amount-left">Amount Left</Label>
                <Input
                  id="amount-left"
                  type="number"
                  min={0}
                  value={amountLeft}
                  onChange={(event) => setAmountLeft(event.target.value)}
                  placeholder="0"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last-payment-date">Last Payment Date</Label>
                <Input
                  id="last-payment-date"
                  type="date"
                  value={lastPaymentDate}
                  onChange={(event) => setLastPaymentDate(event.target.value)}
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest-rate">Interest Rate</Label>
                <div className="relative">
                  <Input
                    id="interest-rate"
                    type="number"
                    min={0}
                    step={0.01}
                    value={interestRate}
                    onChange={(event) => setInterestRate(event.target.value)}
                    placeholder="0"
                    className="rounded-xl border-0 bg-[#f4f3f2] pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#666]">%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
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
                  addDebtItem();
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
