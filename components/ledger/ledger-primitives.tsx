"use client";

import { cn } from "@/lib/utils";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function StatCard({
  label,
  value,
  helper,
  emphasize = false,
}: {
  label: string;
  value: number;
  helper?: string;
  emphasize?: boolean;
}) {
  return (
    <article
      className={cn(
        "rounded-2xl p-5",
        emphasize ? "bg-[#536346] text-white" : "bg-white text-[#1a1c1c]",
      )}
    >
      <p className={cn("text-xs uppercase tracking-[0.14em]", emphasize ? "text-white/80" : "text-[#76806a]")}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.02em]">{formatCurrency(value)}</p>
      {helper ? (
        <p className={cn("mt-2 text-sm", emphasize ? "text-white/75" : "text-[#5f6558]")}>{helper}</p>
      ) : null}
    </article>
  );
}

export function BucketProgress({
  label,
  spent,
  target,
  status,
}: {
  label: string;
  spent: number;
  target: number;
  status: "ok" | "warning" | "critical";
}) {
  const ratio = target === 0 ? 0 : Math.min((spent / target) * 100, 100);
  const barColor =
    status === "critical"
      ? "bg-[#ba1a1a]"
      : status === "warning"
        ? "bg-[#b7791f]"
        : "bg-[#536346]";

  return (
    <div className="space-y-2 rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#1a1c1c]">{label}</p>
        <p className="text-sm tabular-nums text-[#5f6558]">
          {formatCurrency(spent)} / {formatCurrency(target)}
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-[#e3e2e1]">
        <div className={cn("h-1.5 rounded-full transition-all", barColor)} style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}

export function OwnerChip({ name }: { name: string }) {
  return (
    <span className="rounded-full bg-[#edf2e8] px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-[#536346]">
      {name}
    </span>
  );
}

export function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points, 1);

  return (
    <div className="grid h-20 grid-cols-6 items-end gap-2 rounded-2xl bg-white p-4">
      {points.map((point, index) => {
        const height = Math.max(8, Math.round((point / max) * 56));
        return (
          <div key={`${point}-${index}`} className="flex flex-col items-center gap-1">
            <div className="w-full rounded-full bg-[#536346]" style={{ height }} />
            <p className="text-[10px] text-[#7c8273]">M{index + 1}</p>
          </div>
        );
      })}
    </div>
  );
}

export { formatCurrency };
