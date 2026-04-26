"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Database } from "@/app/types/supabase";
import { createClient } from "@/lib/supabase/client";

function addDaysToDate(date: string, days: number) {
  const [year, month, day] = date.split("-").map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day));
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate.toISOString().slice(0, 10);
}

export default function NewBudgetSetupPage() {
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [maxLimit, setMaxLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 1 && Number.isFinite(Number(maxLimit)) && Number(maxLimit) > 0 && !!startDate;

  const resetForm = () => {
    setName("");
    setMaxLimit("");
    setStartDate("");
    setEndDate("");
    setFormError(null);
  };

  const handleCreateBudget = async () => {
    if (!canSubmit) {
      setFormError("Please complete all required fields.");
      return;
    }

    setIsSaving(true);
    setFormError(null);
    setSuccessMessage(null);

    const computedEndDate = endDate || addDaysToDate(startDate, 30);
    const { data: authData } = await supabase.auth.getUser();

    const payload: Database["public"]["Tables"]["budgets"]["Insert"] = {
      name: name.trim(),
      total_limit: Number(maxLimit),
      start_date: startDate,
      end_date: computedEndDate,
      created_by: authData.user?.id,
    };

    const { error } = await supabase.from("budgets").insert(payload);

    if (error) {
      setFormError(error.message);
      setIsSaving(false);
      return;
    }

    setSuccessMessage("Budget saved successfully.");
    setIsSaving(false);
    setOpen(false);
    resetForm();
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">New Budget Setup</h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Start Fresh</h3>
          <p className="mt-2 text-sm text-[#5f6558]">Clear this month and begin from a clean budget.</p>
          <Button onClick={() => setOpen(true)} className="mt-4 rounded-full bg-[#536346] text-white hover:bg-[#445537]">
            Start Fresh
          </Button>
        </article>

        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Reuse Last Month</h3>
          <p className="mt-2 text-sm text-[#5f6558]">Carry over categories and recurring items with payment states reset.</p>
          <Button onClick={() => setOpen(true)} className="mt-4 rounded-full bg-[#536346] text-white hover:bg-[#445537]">
            Reuse Last Month
          </Button>
        </article>
      </div>

      {successMessage ? <p className="text-sm text-[#536346]">{successMessage}</p> : null}

      {open ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#1a1c1c]/20 px-4 py-6 backdrop-blur-sm md:items-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Create New Budget</h3>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget-name">Budget Name</Label>
                <Input
                  id="budget-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Household Budget"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-limit">Max Limit</Label>
                <Input
                  id="budget-limit"
                  type="number"
                  min={0}
                  value={maxLimit}
                  onChange={(event) => setMaxLimit(event.target.value)}
                  placeholder="0"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-start-date">Start Date</Label>
                <Input
                  id="budget-start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-end-date">End Date (Optional)</Label>
                <Input
                  id="budget-end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                />
                <p className="text-xs text-[#5f6558]">
                  If omitted, the end date will be set to 30 days after the start date.
                </p>
              </div>

              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleCreateBudget()}
                disabled={!canSubmit || isSaving}
                className="rounded-full bg-[#536346] text-white hover:bg-[#445537]"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

    </section>
  );
}
