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
  ownerId: string;
  debtId?: string;
  linkedExpenseId?: string;
  offsetAmount?: number;
  counterparty?: string;
  createdAt: string;
  paidAt?: string;
};

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Contributor";
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
  ownerId: string;
  debtId?: string;
  linkedExpenseId?: string;
  offsetAmount?: number;
  counterparty?: string;
};
