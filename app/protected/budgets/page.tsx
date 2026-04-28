"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/app/types/supabase";
import { Spinner } from "@/components/ui/spinner";

type BudgetRow = Database["public"]["Tables"]["budgets"]["Row"];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function formatDate(value: string | null) {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString();
}

export default function BudgetsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [budgets, setBudgets] = useState<BudgetRow[]>([]);
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(true);
  const [budgetsError, setBudgetsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadBudgets() {
      setIsLoadingBudgets(true);
      setBudgetsError(null);

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        setBudgetsError(error.message);
        setBudgets([]);
      } else {
        setBudgets(data ?? []);
      }

      setIsLoadingBudgets(false);
    }

    void loadBudgets();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Budgets</h2>
        <p className="mt-2 text-sm text-[#5f6558]">Pick a budget card to view full details.</p>
      </header>

      {isLoadingBudgets ? <Spinner className="size-6 text-[#536346]" /> : null}
      {budgetsError ? <p className="text-sm text-red-600">Unable to load budgets: {budgetsError}</p> : null}
      {!isLoadingBudgets && !budgetsError && budgets.length === 0 ? (
        <p className="text-sm text-[#5f6558]">No budgets found yet.</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {budgets.map((budget) => (
          <Link
            key={budget.id}
            href={`/protected/budgets/${budget.id}`}
            className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e8ece6] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Budget</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c] group-hover:text-[#536346]">
              {budget.name}
            </h3>
            <p className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">
              {currencyFormatter.format(budget.total_limit)}
            </p>
            <p className="mt-2 text-sm text-[#5f6558]">
              {formatDate(budget.start_date)} to {formatDate(budget.end_date)}
            </p>
            <p className="mt-4 text-sm font-medium text-[#536346]">View details</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
