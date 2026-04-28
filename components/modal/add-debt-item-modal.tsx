"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/app/types/supabase";

type DebtInsert = Database["public"]["Tables"]["debt_items"]["Insert"];

type FormValues = {
  name: string;
  totalAmount: number;
  amountLeft: number;
  dueDate: string;
  interestRate: number;
  minimumPayment: number;
};

export function AddDebtItemModal() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams<{ id?: string }>();
  const budgetId = params.id ?? null;

  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      name: "",
      totalAmount: 0,
      amountLeft: 0,
      dueDate: "",
      interestRate: 0,
    },
  });

  const totalAmount = watch("totalAmount");

  const canSubmit = useMemo(() => isValid, [isValid]);

  const resetForm = () => {
    reset();
    setSubmitError(null);
  };

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setSubmitError(null);
    setIsSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload: DebtInsert = {
      name: formData.name.trim(),
      total_amount: formData.totalAmount,
      remaining_amount: formData.amountLeft,
      due_date: formData.dueDate || null,
      interest_rate: formData.interestRate,
      budget_id: budgetId,
      created_by: user?.id ?? null,
      minimum_payment: formData.minimumPayment
    };

    const { error } = await supabase.from("debt_items").insert(payload);

    if (error) {
      setSubmitError(error.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setOpen(false);
    resetForm();
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

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Field className="space-y-2">
                <FieldLabel htmlFor="debt-item-name">Name</FieldLabel>
                <Input
                  id="debt-item-name"
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
                <FieldLabel htmlFor="debt-item-total-amount">Total Debt Amount</FieldLabel>
                <Input
                  id="debt-item-total-amount"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(errors.totalAmount)}
                  placeholder="0"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                  {...register("totalAmount", {
                    required: "Total debt amount is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Total debt amount must be greater than 0",
                    },
                  })}
                />
                <FieldError errors={[errors.totalAmount]} />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="debt-item-amount-left">Amount Left</FieldLabel>
                <Input
                  id="debt-item-amount-left"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(errors.amountLeft)}
                  placeholder="0"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                  {...register("amountLeft", {
                    required: "Amount left is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Amount left cannot be negative",
                    },
                    validate: (value) => {
                      if (!Number.isFinite(totalAmount)) {
                        return true;
                      }

                      if (value > totalAmount) {
                        return "Amount left cannot be more than total debt amount";
                      }

                      return true;
                    },
                  })}
                />
                <FieldError errors={[errors.amountLeft]} />
                <FieldDescription>Current remaining principal.</FieldDescription>
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="debt-item-total-amount">Minmum payment</FieldLabel>
                <Input
                  id="debt-item-total-amount"
                  type="number"
                  min={0}
                  aria-invalid={Boolean(errors.minimumPayment)}
                  placeholder="0"
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                  {...register("minimumPayment", {
                    valueAsNumber: true,
                  })}
                />
                <FieldDescription>
                  The minmum payment per month
                </FieldDescription>
                <FieldError errors={[errors.minimumPayment]} />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="debt-item-due-date">Due Date</FieldLabel>
                <Input
                  id="debt-item-due-date"
                  type="date"
                  aria-invalid={Boolean(errors.dueDate)}
                  className="rounded-xl border-0 bg-[#f4f3f2]"
                  {...register("dueDate", {
                    required: "Due date is required",
                  })}
                />
                <FieldError errors={[errors.dueDate]} />
              </Field>

              <Field className="space-y-2">
                <FieldLabel htmlFor="debt-item-interest-rate">Interest Rate</FieldLabel>
                <div className="relative">
                  <Input
                    id="debt-item-interest-rate"
                    type="number"
                    min={0}
                    step={0.01}
                    aria-invalid={Boolean(errors.interestRate)}
                    placeholder="0"
                    className="rounded-xl border-0 bg-[#f4f3f2] pr-8"
                    {...register("interestRate", {
                      required: "Interest rate is required",
                      valueAsNumber: true,
                      min: {
                        value: 0,
                        message: "Interest rate cannot be negative",
                      },
                    })}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#666]">%</span>
                </div>
                <FieldError errors={[errors.interestRate]} />
              </Field>

              {submitError ? <p className="text-sm text-red-600">Unable to save item: {submitError}</p> : null}

              <div className="mt-6 flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                >
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
