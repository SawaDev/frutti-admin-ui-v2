import { z } from "zod"
import { Wallet } from "./wallets"
import { expenseCategorySchema, expenseSchema } from "@/schema/expenses";

export interface ExpenseCategory {
  id: number;
  name: string;

  created_at: string
  updated_at: string
}

export type ExpenseCategoryType = z.infer<typeof expenseCategorySchema>

export interface GetAllExpenseCategoriesResponse {
  success: boolean
  data: ExpenseCategory[]
}

export interface GetSingleExpenseCategoryResponse {
  success: boolean
  data: ExpenseCategory
}

export interface Expense {
  id: number
  wallet: Wallet
  expense_category: ExpenseCategory | null
  amount: number
  comment: string | null

  created_at: string
  updated_at: string
}

export interface GetAllExpensesResponse {
  success: boolean
  data: Expense[]
}

export interface GetSingleExpenseResponse {
  success: boolean
  data: Expense
}

export type ExpenseType = z.infer<typeof expenseSchema>
export type ExpenseDataType = Omit<ExpenseType, "wallet_id" | "category_id"> & {
  wallet_id: number;
  category_id: number | null;
};