"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Database } from "@/app/types/supabase";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { AddBudgetItemModal } from "@/components/modal/add-budget-item-modal";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BudgetItem } from "../../../../components/ledger-types";

type BudgetItemRow = Database["public"]["Tables"]["budget_items"]["Row"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatDate(value: string | null) {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString();
}

export default function BudgetDetailPage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams<{ id: string }>();
  const budgetId = params.id;

  const [budgetItems, setBudgetItems] = useState<BudgetItemRow[] | null>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(true);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBudget() {
      setIsLoadingBudget(true);
      setBudgetError(null);

      const { data, error } = await supabase
        .from("budget_items")
        .select("*")
        .eq("budget_id", budgetId);

      console.log(data);
      console.log(error);

      if (!isMounted) {
        return;
      }

      if (error) {
        setBudgetError(error.message);
        setBudgetItems(null);
      } else {
        setBudgetItems(data);
      }

      setIsLoadingBudget(false);
    }

    if (budgetId) {
      void loadBudget();
    }

    return () => {
      isMounted = false;
    };
  }, [budgetId, supabase]);

  return (
    <section className='space-y-6'>
      <header className='flex items-start justify-between gap-3'>
        <div>
          <p className='text-xs uppercase tracking-[0.14em] text-[#76806a]'>
            Budget Detail
          </p>
          {/* <h2 className="mt-2 text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">
            {budgetItems?.name ?? "Budget"}
          </h2> */}
        </div>
        <div className='flex items-center gap-2'>
          <AddBudgetItemModal />
          <Link
            href='/protected/budgets'
            className='text-sm font-medium text-[#536346] hover:underline'
          >
            Back to Budgets
          </Link>
        </div>
      </header>

      {isLoadingBudget ? <Spinner className='size-6 text-[#536346]' /> : null}
      {budgetError ? (
        <p className='text-sm text-red-600'>
          Unable to load budget: {budgetError}
        </p>
      ) : null}

      {budgetItems ? (
        <article className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e8ece6]'>
          <div className='grid gap-4 md:grid-cols-2'>
            {/* <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Total Limit</p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">
                {currencyFormatter.format(budget.total_limit)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Date Range</p>
              <p className="mt-2 text-lg font-medium text-[#1a1c1c]">
                {formatDate(budget.start_date)} to {formatDate(budget.end_date)}
              </p>
            </div> */}
            <div>
              <p className='text-xs uppercase tracking-[0.14em] text-[#76806a]'>
                Budget ID
              </p>
              {/* <p className='mt-2 break-all text-sm text-[#5f6558]'>
                {budgetItems.id}
              </p> */}
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.14em] text-[#76806a]'>
                Created
              </p>
              {/* <p className='mt-2 text-sm text-[#5f6558]'>
                {formatDate(budgetItems.created_at)}
              </p> */}
            </div>
          </div>
        </article>
      ) : null}
      {budgetItems?.map((e, key) => (
        <Card key={key}>
          <CardHeader>{e.name}</CardHeader>
          <CardContent>R{e.amount} {e.paid}</CardContent>
        </Card>
      ))}
    </section>
  );
}
