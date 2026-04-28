"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/app/types/supabase";

type Bucket = "need" | "investment" | "want" | "emergency";
type BudgetItemInsert = Database["public"]["Tables"]["budget_items"]["Insert"];
type BudgetItemRow = Database["public"]["Tables"]["budget_items"]["Row"];
type DebtItemRow = Database["public"]["Tables"]["debt_items"]["Row"];


const bucketOptions: Array<{ value: Bucket; label: string }> = [
  { value: "need", label: "Needs (50%)" },
  { value: "investment", label: "Investments (20%)" },
  { value: "want", label: "Wants (15%)" },
  { value: "emergency", label: "Emergency (15%)" },
];

type FormValues = {
  name: string;
  amount: number;
  entryType: "expense" | "reimbursement";
  bucket: Bucket;
  debtId: string;
  counterparty: string;
  linkedExpenseId: string;
  offsetAmount: string;
  recurring: boolean;
};

export function AddBudgetItemModal() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams<{ id?: string }>();
  const budgetId = params.id ?? null;

  const [open, setOpen] = useState(false);
  const [expenseOptions, setExpenseOptions] = useState<BudgetItemRow[]>([]);
  const [debtOptions, setDebtOptions] = useState<DebtItemRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      amount: 0,
      entryType: "expense",
      bucket: "need",
      debtId: "",
      counterparty: "",
      linkedExpenseId: "",
      offsetAmount: "",
      recurring: false,
    },
  });

  const entryType = watch("entryType");
  const amount = watch("amount");
  const linkedExpenseId = watch("linkedExpenseId");
  const offsetAmount = watch("offsetAmount");

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    async function loadOptions() {
      setLoadError(null);

      const expenseQuery = supabase
        .from("budget_items")
        .select("*")
        .eq("type", "expense")
        .order("created_at", { ascending: false });

      const debtQuery = supabase
        .from("debt_items")
        .select("*")
        .order("created_at", { ascending: false });

      const [expenseResult, debtResult] = budgetId
        ? await Promise.all([
            expenseQuery.eq("budget_id", budgetId),
            debtQuery.eq("budget_id", budgetId),
          ])
        : await Promise.all([expenseQuery, debtQuery]);

      if (!isMounted) {
        return;
      }

      if (expenseResult.error || debtResult.error) {
        setLoadError(expenseResult.error?.message ?? debtResult.error?.message ?? "Unable to load options");
        setExpenseOptions([]);
        setDebtOptions([]);
        return;
      }

      setExpenseOptions(expenseResult.data ?? []);
      setDebtOptions(debtResult.data ?? []);
    }

    void loadOptions();

    return () => {
      isMounted = false;
    };
  }, [open, budgetId, supabase]);

  useEffect(() => {
    if (entryType !== "expense") {
      if (linkedExpenseId) {
        setValue("linkedExpenseId", "", { shouldValidate: true });
      }
      if (offsetAmount) {
        setValue("offsetAmount", "", { shouldValidate: true });
      }
      return;
    }

    if (!linkedExpenseId) {
      if (offsetAmount) {
        setValue("offsetAmount", "", { shouldValidate: true });
      }
      return;
    }

    const linked = expenseOptions.find((item) => item.id === linkedExpenseId);
    const nextOffsetAmount = String(linked?.amount ?? 0);

    if (offsetAmount !== nextOffsetAmount) {
      setValue("offsetAmount", nextOffsetAmount, { shouldValidate: true });
    }
  }, [entryType, linkedExpenseId, offsetAmount, expenseOptions, setValue]);

  const netPreview =
    entryType === "expense"
      ? (Number.isFinite(amount) ? amount : 0) - Number(offsetAmount || 0)
      : -(Number.isFinite(amount) ? amount : 0);

  const canSubmit = useMemo(() => isValid, [isValid]);

  const closeAndReset = () => {
    setOpen(false);
    setSubmitError(null);
    reset();
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setSubmitError(null);
    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload: BudgetItemInsert = {
      name: formData.name.trim(),
      amount: formData.amount,
      budget_id: budgetId,
      category: formData.bucket,
      counterparty: formData.counterparty.trim() || null,
      created_by: user?.id ?? null,
      debt_id: formData.debtId || null,
      is_recurring: formData.recurring,
      offset_item_id: formData.linkedExpenseId || null,
      type: formData.entryType,
    };

    console.log(payload);

    const { error } = await supabase.from("budget_items").insert(payload);

    console.error(error);

    if (error) {
      setSubmitError(error.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    closeAndReset();
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

            {loadError ? <p className="mb-3 text-sm text-red-600">Unable to load form options: {loadError}</p> : null}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Field className="space-y-2">
                <FieldLabel htmlFor="budget-item-name">Name</FieldLabel>
                <Input
                  id="budget-item-name"
                  aria-invalid={Boolean(errors.name)}
                  placeholder="Medical Aid"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                <FieldError errors={[errors.name]} />
              </Field>

              <Field className="space-y-2">
                <FieldLabel>Type</FieldLabel>
                <input type="hidden" {...register("entryType", { required: "Type is required" })} />
                <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#f4f3f2] p-1">
                  <button
                    type="button"
                    onClick={() => setValue("entryType", "expense", { shouldValidate: true })}
                    className={`rounded-lg px-3 py-2 text-sm ${entryType === "expense" ? "bg-white text-[#1a1c1c]" : "text-[#5f6558]"}`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("entryType", "reimbursement", { shouldValidate: true })}
                    className={`rounded-lg px-3 py-2 text-sm ${entryType === "reimbursement" ? "bg-white text-[#1a1c1c]" : "text-[#5f6558]"}`}
                  >
                    Reimbursement
                  </button>
                </div>
                <FieldError errors={[errors.entryType]} />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="budget-item-amount">Amount</FieldLabel>
                <Input
                  id="budget-item-amount"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(errors.amount)}
                  placeholder="0"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                  {...register("amount", {
                    required: "Amount is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Amount must be greater than 0",
                    },
                  })}
                />
                <FieldError errors={[errors.amount]} />
              </Field>

              {entryType === "expense" ? (
                <>
                  <Field className="space-y-2">
                    <FieldLabel htmlFor="budget-item-counterparty">Counterparty (Optional)</FieldLabel>
                    <Input
                      id="budget-item-counterparty"
                      placeholder="Jane"
                      className="rounded-xl border-0 bg-[#f4f3f2]"
                      {...register("counterparty")}
                    />
                  </Field>

                  <Field className="space-y-2">
                    <FieldLabel htmlFor="budget-item-linked-expense">Link To Existing Expense (Offset)</FieldLabel>
                    <select
                      id="budget-item-linked-expense"
                      className="h-10 w-full rounded-xl border-0 bg-[#f4f3f2] px-3 text-sm"
                      {...register("linkedExpenseId")}
                    >
                      <option value="">No linked expense</option>
                      {expenseOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  {linkedExpenseId ? (
                    <Field className="space-y-2">
                      <FieldLabel htmlFor="budget-item-offset">Offset Amount</FieldLabel>
                      <Input
                        id="budget-item-offset"
                        type="number"
                        min={0}
                        aria-invalid={Boolean(errors.offsetAmount)}
                        className="rounded-xl border-0 bg-[#f4f3f2]"
                        {...register("offsetAmount", {
                          validate: (value) => {
                            if (!linkedExpenseId) return true;
                            if (!value) return "Offset amount is required when linked";

                            const numericOffset = Number(value);
                            if (Number.isNaN(numericOffset) || numericOffset < 0) {
                              return "Offset amount must be 0 or greater";
                            }

                            return true;
                          },
                        })}
                      />
                      <FieldError errors={[errors.offsetAmount]} />
                    </Field>
                  ) : null}
                </>
              ) : null}

              <Field className="space-y-2">
                <FieldLabel htmlFor="budget-item-bucket">Category</FieldLabel>
                <select
                  id="budget-item-bucket"
                  className="h-10 w-full rounded-xl border-0 bg-[#f4f3f2] px-3 text-sm"
                  {...register("bucket", { required: "Category is required" })}
                >
                  {bucketOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <FieldError errors={[errors.bucket]} />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="budget-item-debt">Linked Debt (Optional)</FieldLabel>
                <select
                  id="budget-item-debt"
                  className="h-10 w-full rounded-xl border-0 bg-[#f4f3f2] px-3 text-sm"
                  {...register("debtId")}
                >
                  <option value="">Not debt related</option>
                  {debtOptions.map((debt) => (
                    <option key={debt.id} value={debt.id}>
                      {debt.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field className="space-y-2">
                <label className="flex items-center gap-3 text-sm text-[#5f6558]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#c5c8bd]"
                    {...register("recurring")}
                  />
                  Recurring item
                </label>
              </Field>

              <FieldDescription className="text-xs">
                Net {netPreview >= 0 ? "expense" : "credit"}: {Math.abs(netPreview).toFixed(2)}
              </FieldDescription>

              {submitError ? <p className="text-sm text-red-600">Unable to save item: {submitError}</p> : null}

              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="ghost" type="button" onClick={closeAndReset}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || isSaving}
                  className="rounded-full bg-[#536346] text-white hover:bg-[#445537]"
                >
                  {isSaving ? "Saving..." : "Save Item"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
