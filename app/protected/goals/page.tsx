"use client";

import { useEffect, useMemo, useState } from "react";
import { useLedger } from "@/components/ledger-provider";
import { formatCurrency } from "@/components/ledger-primitives";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/app/types/supabase";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import AddGoalItemModal from '@/components/modal/add-goal-item-modal';

type GoalRow = Database["public"]["Tables"]["goals"]["Row"];

export default function GoalsPage() {
  const { goals } = useLedger();
  const supabase = useMemo(() => createClient(), []);
  const [dbGoals, setDbGoals] = useState<GoalRow[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [goalsError, setGoalsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadGoals() {
      setIsLoadingGoals(true);
      setGoalsError(null);

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .order("created_at", { ascending: false });

        console.log(data);

      if (!isMounted) {
        return;
      }

      if (error) {
        setGoalsError(error.message);
        setDbGoals([]);
      } else {
        setDbGoals(data ?? []);
      }

      setIsLoadingGoals(false);
    }

    void loadGoals();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const emergency = goals.find((goal) => goal.type === "emergency");

  return (
    <section className="space-y-6">
      <div className='flex justify-between'>
        <header>
          <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Goals & Emergency Fund</h2>
        </header>
        <AddGoalItemModal/>
      </div>

      {emergency ? (
        <article className="rounded-3xl bg-[#edf2e8] p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-[#536346]">Emergency Fund</p>
          <p className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">
            {formatCurrency(emergency.current)} / {formatCurrency(emergency.target)}
          </p>
          <p className="mt-1 text-sm text-[#5f6558]">Target: 6 months of runway</p>
          <div className="mt-4 h-2 rounded-full bg-white/80">
            <div
              className="h-2 rounded-full bg-[#536346]"
              style={{ width: `${Math.min(100, (emergency.current / emergency.target) * 100)}%` }}
            />
          </div>
        </article>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {isLoadingGoals ? <Spinner /> : null}
        {goalsError ? <p className="text-sm text-red-600">Unable to load goals: {goalsError}</p> : null}
        {!isLoadingGoals && !goalsError && dbGoals.length === 0 ? (
          <p className="text-sm text-[#5f6558]">No goals added yet.</p>
        ) : null}

        {dbGoals.map((goal) => {
          const currentAmount = goal.current_amount ?? 0;
          const progress =
            goal.target_amount > 0 ? Math.min(100, (currentAmount / goal.target_amount) * 100) : 0;

          return (
            <article key={goal.id} className="rounded-2xl bg-white p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Active Goal</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">{goal.name}</h3>
              <p className="mt-2 text-sm text-[#5f6558]">
                {formatCurrency(currentAmount)} saved of {formatCurrency(goal.target_amount)}
              </p>
              {goal.description ? <p className="mt-2 text-sm text-[#5f6558]">{goal.description}</p> : null}
              <div className="mt-4 h-1.5 rounded-full bg-[#e3e2e1]">
                <div className="h-1.5 rounded-full bg-[#536346]" style={{ width: `${progress}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
