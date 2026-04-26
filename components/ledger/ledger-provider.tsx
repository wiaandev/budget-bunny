"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AddBudgetItemPayload,
  BudgetItem,
  Bucket,
  Debt,
  Goal,
  IncomeStream,
} from "./ledger-types";

type LedgerState = {
  incomeStreams: IncomeStream[];
  budgetItems: BudgetItem[];
  debts: Debt[];
  goals: Goal[];
  ohCrapFund: number;
  whatIfRaisePct: number;
};

type BudgetItemWithNet = BudgetItem & {
  effectiveAmount: number;
  netDirection: "expense" | "reimbursement";
};

type LedgerContextValue = LedgerState & {
  budgetItemsWithNet: BudgetItemWithNet[];
  totalIncome: number;
  totalAllocated: number;
  reimbursementTotal: number;
  availableToAllocate: number;
  leftoverBalance: number;
  bucketTotals: Record<Bucket, number>;
  bucketTargets: Record<Bucket, number>;
  warnings: Record<Bucket, "ok" | "warning" | "critical">;
  debtProgress: Array<Debt & { paidTowardDebt: number; remainingPrincipal: number }>;
  spendingVelocity: number;
  projectedMonthlyIncome: number;
  projectionCurve: number[];
  addBudgetItem: (payload: AddBudgetItemPayload) => void;
  updateBudgetItem: (
    itemId: string,
    payload: Partial<
      Pick<
        BudgetItem,
        | "name"
        | "amount"
        | "bucket"
        | "entryType"
        | "recurring"
        | "debtId"
        | "linkedExpenseId"
        | "offsetAmount"
        | "counterparty"
      >
    >,
  ) => void;
  deleteBudgetItem: (itemId: string) => void;
  toggleBudgetPaid: (itemId: string) => void;
  updateIncomeStream: (streamId: string, amount: number) => void;
  updateOhCrapFund: (value: number) => void;
  updateWhatIfRaisePct: (value: number) => void;
  startFresh: () => void;
  reuseLastMonth: () => void;
};

const STORAGE_KEY = "budget-bunny-state-v1";

const defaultDebts: Debt[] = [
  {
    id: "debt-visa",
    name: "Visa Platinum",
    principal: 4800,
    interestRate: 18.9,
    minimumPayment: 180,
  },
  {
    id: "debt-car",
    name: "Auto Loan",
    principal: 12200,
    interestRate: 6.2,
    minimumPayment: 320,
  },
];

const defaultIncome: IncomeStream[] = [
  { id: "income-1", name: "Primary Salary", amount: 5200 },
  { id: "income-2", name: "Freelance", amount: 640 },
];

const defaultBudgetItems: BudgetItem[] = [
  {
    id: "item-1",
    name: "Rent",
    amount: 1700,
    bucket: "needs",
    entryType: "expense",
    recurring: true,
    paid: true,
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  },
  {
    id: "item-2",
    name: "Groceries",
    amount: 520,
    bucket: "needs",
    entryType: "expense",
    recurring: true,
    paid: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-3",
    name: "Index Fund Auto-Invest",
    amount: 960,
    bucket: "investments",
    entryType: "expense",
    recurring: true,
    paid: true,
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  },
  {
    id: "item-4",
    name: "Dining Out",
    amount: 320,
    bucket: "wants",
    entryType: "expense",
    recurring: true,
    paid: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-5",
    name: "Emergency Transfer",
    amount: 430,
    bucket: "emergency",
    entryType: "expense",
    recurring: true,
    paid: true,
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  },
  {
    id: "item-6",
    name: "Visa Extra Payment",
    amount: 200,
    bucket: "needs",
    entryType: "expense",
    recurring: false,
    paid: true,
    debtId: "debt-visa",
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  },
];

function getEffectiveAmount(item: BudgetItem) {
  if (item.entryType === "reimbursement") {
    return -Math.abs(item.amount);
  }

  const offset = item.offsetAmount ?? 0;
  return item.amount - offset;
}

const defaultGoals: Goal[] = [
  {
    id: "goal-emergency",
    name: "Emergency Fund",
    target: 18000,
    current: 6400,
    type: "emergency",
  },
  {
    id: "goal-trip",
    name: "Cape Town Winter Escape",
    target: 3500,
    current: 1200,
    type: "ambition",
  },
  {
    id: "goal-studio",
    name: "Home Studio Build",
    target: 2400,
    current: 960,
    type: "ambition",
  },
];

const defaultState: LedgerState = {
  incomeStreams: defaultIncome,
  budgetItems: defaultBudgetItems,
  debts: defaultDebts,
  goals: defaultGoals,
  ohCrapFund: 300,
  whatIfRaisePct: 6,
};

const LedgerContext = createContext<LedgerContextValue | null>(null);

function calcWarnings(
  totals: Record<Bucket, number>,
  targets: Record<Bucket, number>,
): Record<Bucket, "ok" | "warning" | "critical"> {
  return {
    needs:
      totals.needs > targets.needs
        ? "critical"
        : totals.needs >= targets.needs * 0.95
          ? "warning"
          : "ok",
    investments:
      totals.investments > targets.investments
        ? "critical"
        : totals.investments >= targets.investments * 0.95
          ? "warning"
          : "ok",
    wants:
      totals.wants > targets.wants
        ? "critical"
        : totals.wants >= targets.wants * 0.95
          ? "warning"
          : "ok",
    emergency:
      totals.emergency > targets.emergency
        ? "critical"
        : totals.emergency >= targets.emergency * 0.95
          ? "warning"
          : "ok",
  };
}

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LedgerState>(defaultState);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as LedgerState;
      setState(parsed);
    } catch {
      setState(defaultState);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalIncome = useMemo(
    () => state.incomeStreams.reduce((sum, stream) => sum + stream.amount, 0),
    [state.incomeStreams],
  );

  const budgetItemsWithNet = useMemo<BudgetItemWithNet[]>(
    () =>
      state.budgetItems.map((item) => {
        const effectiveAmount = getEffectiveAmount(item);
        return {
          ...item,
          effectiveAmount,
          netDirection: effectiveAmount >= 0 ? "expense" : "reimbursement",
        };
      }),
    [state.budgetItems],
  );

  const bucketTotals = useMemo<Record<Bucket, number>>(
    () =>
      budgetItemsWithNet.reduce(
        (totals, item) => {
          totals[item.bucket] += item.effectiveAmount;
          return totals;
        },
        { needs: 0, investments: 0, wants: 0, emergency: state.ohCrapFund },
      ),
    [budgetItemsWithNet, state.ohCrapFund],
  );

  const bucketTargets = useMemo<Record<Bucket, number>>(
    () => ({
      needs: totalIncome * 0.5,
      investments: totalIncome * 0.2,
      wants: totalIncome * 0.15,
      emergency: totalIncome * 0.15,
    }),
    [totalIncome],
  );

  const totalAllocated = useMemo(
    () =>
      budgetItemsWithNet.reduce((sum, item) => sum + item.effectiveAmount, 0) +
      state.ohCrapFund,
    [budgetItemsWithNet, state.ohCrapFund],
  );

  const reimbursementTotal = useMemo(
    () =>
      budgetItemsWithNet
        .filter((item) => item.effectiveAmount < 0)
        .reduce((sum, item) => sum + Math.abs(item.effectiveAmount), 0),
    [budgetItemsWithNet],
  );

  const availableToAllocate = totalIncome - totalAllocated;

  const leftoverBalance = useMemo(
    () =>
      totalIncome -
      budgetItemsWithNet
        .filter((item) => item.paid)
        .reduce((sum, item) => sum + item.effectiveAmount, 0) -
      state.ohCrapFund,
    [budgetItemsWithNet, state.ohCrapFund, totalIncome],
  );

  const warnings = useMemo(
    () => calcWarnings(bucketTotals, bucketTargets),
    [bucketTargets, bucketTotals],
  );

  const debtProgress = useMemo(
    () =>
      state.debts.map((debt) => {
        const paidTowardDebt = budgetItemsWithNet
          .filter((item) => item.debtId === debt.id && item.paid)
          .reduce((sum, item) => sum + Math.max(0, item.effectiveAmount), 0);

        return {
          ...debt,
          paidTowardDebt,
          remainingPrincipal: Math.max(0, debt.principal - paidTowardDebt),
        };
      }),
    [budgetItemsWithNet, state.debts],
  );

  const spendingVelocity = useMemo(() => {
    const paid = budgetItemsWithNet
      .filter((item) => item.paid)
      .reduce((sum, item) => sum + item.effectiveAmount, 0);
    // Use a normalized month window to keep prerendering deterministic.
    return paid / 30;
  }, [budgetItemsWithNet]);

  const projectedMonthlyIncome = useMemo(
    () => totalIncome * (1 + state.whatIfRaisePct / 100),
    [state.whatIfRaisePct, totalIncome],
  );

  const projectionCurve = useMemo(
    () =>
      Array.from({ length: 6 }, (_, monthIndex) =>
        Math.round(projectedMonthlyIncome * (1 + monthIndex * 0.015)),
      ),
    [projectedMonthlyIncome],
  );

  const addBudgetItem = useCallback((payload: AddBudgetItemPayload) => {
    setState((prev) => ({
      ...prev,
      budgetItems: [
        {
          id: crypto.randomUUID(),
          name: payload.name,
          amount: payload.amount,
          bucket: payload.bucket,
          entryType: payload.entryType,
          recurring: payload.recurring,
          paid: false,
          debtId: payload.debtId,
          linkedExpenseId: payload.linkedExpenseId,
          offsetAmount: payload.offsetAmount,
          counterparty: payload.counterparty,
          createdAt: new Date().toISOString(),
        },
        ...prev.budgetItems,
      ],
    }));
  }, []);

  const updateBudgetItem = useCallback(
    (
      itemId: string,
      payload: Partial<
        Pick<
          BudgetItem,
          | "name"
          | "amount"
          | "bucket"
          | "entryType"
          | "recurring"
          | "debtId"
          | "linkedExpenseId"
          | "offsetAmount"
          | "counterparty"
        >
      >,
    ) => {
      setState((prev) => ({
        ...prev,
        budgetItems: prev.budgetItems.map((item) => {
          if (item.id !== itemId) return item;
          return {
            ...item,
            ...payload,
          };
        }),
      }));
    },
    [],
  );

  const deleteBudgetItem = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.filter((item) => item.id !== itemId),
    }));
  }, []);

  const toggleBudgetPaid = useCallback((itemId: string) => {
    setState((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.map((item) => {
        if (item.id !== itemId) return item;
        const nextPaid = !item.paid;
        return {
          ...item,
          paid: nextPaid,
          paidAt: nextPaid ? new Date().toISOString() : undefined,
        };
      }),
    }));
  }, []);

  const updateIncomeStream = useCallback((streamId: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      incomeStreams: prev.incomeStreams.map((stream) =>
        stream.id === streamId ? { ...stream, amount } : stream,
      ),
    }));
  }, []);

  const updateOhCrapFund = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      ohCrapFund: Math.max(0, value),
    }));
  }, []);

  const updateWhatIfRaisePct = useCallback((value: number) => {
    setState((prev) => ({
      ...prev,
      whatIfRaisePct: Math.max(0, Math.min(40, value)),
    }));
  }, []);

  const startFresh = useCallback(() => {
    setState((prev) => ({
      ...prev,
      budgetItems: [],
    }));
  }, []);

  const reuseLastMonth = useCallback(() => {
    setState((prev) => ({
      ...prev,
      budgetItems: prev.budgetItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        paid: false,
        paidAt: undefined,
        createdAt: new Date().toISOString(),
      })),
    }));
  }, []);

  const value = useMemo<LedgerContextValue>(
    () => ({
      ...state,
      budgetItemsWithNet,
      totalIncome,
      totalAllocated,
      reimbursementTotal,
      availableToAllocate,
      leftoverBalance,
      bucketTotals,
      bucketTargets,
      warnings,
      debtProgress,
      spendingVelocity,
      projectedMonthlyIncome,
      projectionCurve,
      addBudgetItem,
      updateBudgetItem,
      deleteBudgetItem,
      toggleBudgetPaid,
      updateIncomeStream,
      updateOhCrapFund,
      updateWhatIfRaisePct,
      startFresh,
      reuseLastMonth,
    }),
    [
      state,
      budgetItemsWithNet,
      totalIncome,
      totalAllocated,
      reimbursementTotal,
      availableToAllocate,
      leftoverBalance,
      bucketTotals,
      bucketTargets,
      warnings,
      debtProgress,
      spendingVelocity,
      projectedMonthlyIncome,
      projectionCurve,
      addBudgetItem,
      updateBudgetItem,
      deleteBudgetItem,
      toggleBudgetPaid,
      updateIncomeStream,
      updateOhCrapFund,
      updateWhatIfRaisePct,
      startFresh,
      reuseLastMonth,
    ],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error("useLedger must be used within LedgerProvider");
  }
  return context;
}
