export type Bucket = "needs" | "investments" | "wants" | "emergency";

export type IncomeStream = {
  id: string;
  name: string;
  amount: number;
};

export type Debt = {
  id: string;
  name: string;
  principal: number;
  interestRate: number;
  minimumPayment: number;
};

export type BudgetItem = {
  id: string;
  name: string;
  amount: number;
  bucket: Bucket;
  entryType: "expense" | "reimbursement";
  recurring: boolean;
  paid: boolean;
  debtId?: string;
  linkedExpenseId?: string;
  offsetAmount?: number;
  counterparty?: string;
  createdAt: string;
  paidAt?: string;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  type: "emergency" | "ambition";
};

export type AddBudgetItemPayload = {
  name: string;
  amount: number;
  bucket: Bucket;
  entryType: "expense" | "reimbursement";
  recurring: boolean;
  debtId?: string;
  linkedExpenseId?: string;
  offsetAmount?: number;
  counterparty?: string;
};
