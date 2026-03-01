import { createClient } from "@/lib/supabase/server";
import { cacheLife, cacheTag } from "next/cache";
import React, { Suspense } from "react";

export default async function BudgetsPage() {
  const supabase = await createClient();

const { data } = await supabase
  .from('Budget')
  .select(`
   *
  `)

  console.log(data);
//   console.log(error);
  //   console.log(budgets)

  return (
    <Suspense>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Suspense>
  );
}
