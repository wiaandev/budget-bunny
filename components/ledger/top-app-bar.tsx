"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, UserCircle2 } from "lucide-react";
import { useLedger } from "./ledger-provider";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/protected", label: "Dashboard" },
  { href: "/protected/budgets", label: "Monthly Budget" },
  { href: "/protected/debts", label: "Debt Tracker" },
  { href: "/protected/goals", label: "Goals" },
  { href: "/protected/transactions", label: "Transactions" },
  { href: "/protected/setup", label: "New Budget" },
];

function MoneyValue({ value }: { value: number }) {
  return (
    <p className={cn("font-semibold tabular-nums", value < 0 ? "text-red-700" : "text-[#536346]")}>
      {new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: "ZAR",
        maximumFractionDigits: 0,
      }).format(value)}
    </p>
  );
}

export function TopAppBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { availableToAllocate, leftoverBalance, collaborators } = useLedger();

  const profile = collaborators.find((c) => c.role === "Owner") ?? collaborators[0];
  const initials = profile?.name
    ? profile.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "BB";

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#d8ddd1]/40 bg-[#faf9f8]/80 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#76806a]">Budget Bunny</p>
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">Budget Bunny</h1>
          </div>
          <div className="grid min-w-[280px] grid-cols-2 gap-3 rounded-2xl bg-white/80 p-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Available to Allocate</p>
              <MoneyValue value={availableToAllocate} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#76806a]">Leftover</p>
              <MoneyValue value={leftoverBalance} />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full bg-white/80 px-2 py-1 pr-3 text-left hover:bg-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#edf2e8] text-xs font-semibold text-[#536346]">
                  {initials}
                </span>
                <span className="hidden text-sm text-[#425037] md:inline">
                  {profile?.name ?? "Profile"}
                </span>
                <ChevronDown className="h-4 w-4 text-[#76806a]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl border-[#d8ddd1] bg-white p-2">
              <DropdownMenuLabel className="px-2 py-2">
                <div className="flex items-start gap-2">
                  <UserCircle2 className="mt-0.5 h-4 w-4 text-[#536346]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1c1c]">{profile?.name ?? "Budget Bunny User"}</p>
                    <p className="text-xs text-[#5f6558]">{profile?.email ?? "profile@budgetbunny.app"}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-[#5f6558]" onSelect={(e) => e.preventDefault()}>
                Account settings (soon)
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-[#ba1a1a]"
                onSelect={(event) => {
                  event.preventDefault();
                  void logout();
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-colors",
                  active ? "bg-[#536346] text-white" : "bg-[#f4f3f2] text-[#425037] hover:bg-[#e9ece5]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
