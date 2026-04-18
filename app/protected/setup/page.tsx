"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OwnerChip } from "@/components/ledger/ledger-primitives";
import { useLedger } from "@/components/ledger/ledger-provider";

export default function NewBudgetSetupPage() {
  const { collaborators, startFresh, reuseLastMonth, inviteCollaborator } = useLedger();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onInvite = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;
    inviteCollaborator(name.trim(), email.trim());
    setName("");
    setEmail("");
  };

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-[#1a1c1c]">New Budget & Collaborators</h2>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Start Fresh</h3>
          <p className="mt-2 text-sm text-[#5f6558]">Clear this month and begin from a clean budget.</p>
          <Button onClick={startFresh} className="mt-4 rounded-full bg-[#536346] text-white hover:bg-[#445537]">
            Start Fresh
          </Button>
        </article>

        <article className="rounded-2xl bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Reuse Last Month</h3>
          <p className="mt-2 text-sm text-[#5f6558]">Carry over categories and recurring items with payment states reset.</p>
          <Button onClick={reuseLastMonth} className="mt-4 rounded-full bg-[#536346] text-white hover:bg-[#445537]">
            Reuse Last Month
          </Button>
        </article>
      </div>

      <article className="rounded-2xl bg-white p-5">
        <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#1a1c1c]">Budget Contributors</h3>
        <div className="mt-4 space-y-3">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center justify-between rounded-xl bg-[#f4f3f2] p-3">
              <div>
                <p className="text-sm font-medium text-[#1a1c1c]">{collaborator.name}</p>
                <p className="text-xs text-[#5f6558]">{collaborator.email}</p>
              </div>
              <OwnerChip name={collaborator.role} />
            </div>
          ))}
        </div>

        <form onSubmit={onInvite} className="mt-5 grid gap-3 md:grid-cols-3">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Collaborator name"
            className="rounded-xl border-0 bg-[#f4f3f2]"
          />
          <Input
            value={email}
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="email@example.com"
            className="rounded-xl border-0 bg-[#f4f3f2]"
          />
          <Button type="submit" className="rounded-full bg-[#536346] text-white hover:bg-[#445537]">
            Send Invite
          </Button>
        </form>
      </article>
    </section>
  );
}
