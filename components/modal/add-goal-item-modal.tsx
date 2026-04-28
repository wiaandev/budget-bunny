"use client";

import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { Calendar } from '../ui/calendar';
import { createClient } from '@/lib/supabase/client';
import type { Database } from "@/app/types/supabase";

type GoalInsert = Database["public"]["Tables"]["goals"]["Insert"];

type FormValues = {
  name: string;
  description: string;
  fullAmount: number;
  currentAmount: number;
  paidOffDate: Date;
};

export default function AddGoalItemModal() {
  const supabase = useMemo(() => createClient(), []);
  const [open, setOpen] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(user?.role);
    const payload: GoalInsert = {
      name: formData.name,
      description: formData.description || null,
      current_amount: formData.currentAmount,
      created_by: user?.id ?? null,
      target_amount: formData.fullAmount,
      target_date: formData.paidOffDate ? formData.paidOffDate.toISOString() : null,
    };
    await supabase.from("goals").insert(payload);
  };
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className='rounded-full bg-[#536346] text-white hover:bg-[#445537]'
      >
        Add Goal Item
      </Button>

      {open ? (
        <div className='fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-[#1a1c1c]/20 px-4 py-6 backdrop-blur-sm md:items-center'>
          <div className='max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6'>
            <div className='mb-4'>
              <h3 className='text-2xl font-semibold tracking-[-0.02em] text-[#1a1c1c]'>
                Add Goal
              </h3>
              <h5 className='text-sm font-sans tracking-[-0.05em] text-[#1a1c1c]'>
                Add anything from savings to emergency fund
              </h5>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Field className='mb-3'>
                <FieldLabel>Name</FieldLabel>
                <Input
                  placeholder='Switzerland Vacation'
                  aria-invalid={Boolean(errors.name)}
                  className={errors.name ? "border-red-500 focus-visible:ring-red-500" : undefined}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 2,
                      message: "Name must be at least 2 characters",
                    },
                  })}
                />
                {errors.name ? (
                  <p className='mt-1 text-xs text-red-600'>{errors.name.message}</p>
                ) : null}
              </Field>
              <Field className='mb-3'>
                <FieldLabel>Description</FieldLabel>
                <Input {...register("description")} />
                <FieldDescription>
                  A short description of the goal
                </FieldDescription>
              </Field>
              <Field className='mb-3'>
                <FieldLabel>Full Amount</FieldLabel>
                <Input
                  placeholder='10,000'
                  aria-invalid={Boolean(errors.fullAmount)}
                  className={errors.fullAmount ? "border-red-500 focus-visible:ring-red-500" : undefined}
                  {...register("fullAmount", {
                    required: "Full amount is required",
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Full amount must be greater than 0",
                    },
                  })}
                />
                {errors.fullAmount ? (
                  <p className='mt-1 text-xs text-red-600'>{errors.fullAmount.message}</p>
                ) : null}
                <FieldDescription>
                  The full amount you owe
                </FieldDescription>
              </Field>
              <Field className='mb-3'>
                <FieldLabel>Current Amount</FieldLabel>
                <Input
                  placeholder='4,000'
                  aria-invalid={Boolean(errors.currentAmount)}
                  className={errors.currentAmount ? "border-red-500 focus-visible:ring-red-500" : undefined}
                  {...register("currentAmount", {
                    required: "Current amount is required",
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: "Current amount cannot be negative",
                    },
                  })}
                />
                {errors.currentAmount ? (
                  <p className='mt-1 text-xs text-red-600'>{errors.currentAmount.message}</p>
                ) : null}
                <FieldDescription>
                  The amount you have paid off
                </FieldDescription>
              </Field>
              <Field className='mb-3'>
                <FieldLabel>Paid-off date</FieldLabel>
                <Controller
                  name="paidOffDate"
                  control={control}
                  rules={{
                    required: "Paid-off date is required",
                  }}
                  render={({ field }) => (
                    <Calendar
                      mode='single'
                      className='bg-white hover:text-black'
                      captionLayout='dropdown'
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  )}
                />
                {errors.paidOffDate ? (
                  <p className='mt-1 text-xs text-red-600'>{errors.paidOffDate.message}</p>
                ) : null}
                <FieldDescription>
                    When this will be paid off
                </FieldDescription>
              </Field>
              <Button type='submit'>Submit</Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
