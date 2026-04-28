"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/protected", label: "Dashboard" },
  { href: "/protected/budgets", label: "Budget" },
  { href: "/protected/debts", label: "Debt" },
  { href: "/protected/goals", label: "Goals" },
  { href: "/protected/transactions", label: "History" },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#d8ddd1]/40 bg-[#faf9f8]/90 px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-2 py-2 text-center text-xs",
                active ? "bg-[#536346] text-white" : "text-[#536346]",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
