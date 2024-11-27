import { transactionSchema } from "@/schema/transactions"
import { z } from "zod"
import { Wallet } from "./wallets"
import { Client } from "./clients"

export interface Transaction {
  id: number
  wallet: Wallet
  client: Client | null
  type: "cash" | "card"
  amount: number

  created_at: string
  updated_at: string
}

export interface GetAllTransactionsResponse {
  success: boolean
  data: Transaction[]
}

export interface GetSingleTransactionResponse {
  success: boolean
  data: Transaction
}

export type TransactionType = z.infer<typeof transactionSchema>
export type TransactionDataType = Omit<TransactionType, "wallet_id" | "client_id"> & {
  wallet_id: number;
  client_id: number | null;
};