"use client";

import { LedgerProvider } from "./ledger-provider";
import { TopAppBar } from "./top-app-bar";
import { SideNavBar } from "./side-nav-bar";
import { BottomNavBar } from "./bottom-nav-bar";

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  return (
    <LedgerProvider>
      <div className="min-h-screen bg-[#faf9f8] text-[#1a1c1c]">
        <TopAppBar />
        <div className="mx-auto flex w-full max-w-7xl pb-20 lg:pb-0">
          <SideNavBar />
          <main className="min-h-[calc(100vh-96px)] w-full px-4 py-6 md:px-8">{children}</main>
        </div>
        <BottomNavBar />
      </div>
    </LedgerProvider>
  );
}
