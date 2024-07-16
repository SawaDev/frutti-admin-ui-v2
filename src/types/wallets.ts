import { createExchangeSchema, walletSchema } from "@/schema/wallets"
import { z } from "zod"

export interface Wallet {
  id: number
  name: string
  balance: number
  type: "dollar" | "sum"
  created_at: string
  updated_at: string
}

export interface GetAllWalletsResponse {
  success: boolean
  data: Wallet[]
}

export interface GetSingleWalletResponse {
  success: boolean
  data: Wallet
}

export type WalletType = z.infer<typeof walletSchema>

export type UpdateWalletType = Omit<WalletType, 'balance'>

export interface Exchange {
  id: number
  from_wallet_id: number
  to_wallet_id: number
  amount: number
  distribution: number | null
  currency_name: string | null
  comment: string | null

  from_wallet?: Wallet
  to_wallet?: Wallet

  created_at: string
}

export interface GetAllExchangesResponse {
  success: boolean
  data: Exchange[]
}

export interface GetSingleExchangeResponse {
  success: boolean
  data: Exchange
}

export type ExchangeType = z.infer<typeof createExchangeSchema>

export type CreateExchangeType = Omit<ExchangeType, 'from_wallet_id' | 'to_wallet_id'> & {
  from_wallet_id: number
  to_wallet_id: number
}