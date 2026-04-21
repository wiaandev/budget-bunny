"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Icon from "@mdi/react";
import { mdiBank, mdiCash, mdiChartPieOutline, mdiFlag, mdiPill, mdiPlus, mdiViewDashboardOutline } from "@mdi/js";

const links = [
  { href: "/protected", label: "Dashboard", icon: mdiViewDashboardOutline },
  {
    href: "/protected/budgets",
    label: "Monthly Budget Planner",
    icon: mdiChartPieOutline,
  },
  { href: "/protected/debts", label: "Debt & Snowball", icon: mdiBank },
  { href: "/protected/goals", label: "Goals & Emergency", icon: mdiFlag },
  { href: "/protected/transactions", label: "Transactions", icon: mdiCash },
  { href: "/protected/setup", label: "New Budget Setup", icon: mdiPlus },
];

const customLinks = [
  {
    href: "/protected/medicine-cabinet",
    label: "Medicine Cabinet",
    icon: mdiPill,
  },
];

export function SideNavBar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 bg-[#f4f3f2] p-6 lg:block">
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#76806a]">Navigation</p>
          <p className="mt-2 text-sm text-[#536346]">Editorial finance workspace</p>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                  active
                    ? "bg-white text-[#1a1c1c]"
                    : "text-[#536346] hover:bg-white/70",
                )}
              >
                <Icon path={link.icon} size={0.8} className="shrink-0" />
                {link.label}
              </Link>
            );
          })}
          <div className="my-2 h-px bg-[#c5c8bd]/50" />
          {customLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                  active
                    ? "bg-white text-[#1a1c1c]"
                    : "text-[#536346] hover:bg-white/70",
                )}
              >
                <Icon path={link.icon} size={0.8} className="shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
