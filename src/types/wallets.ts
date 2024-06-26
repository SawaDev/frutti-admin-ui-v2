import { walletSchema } from "@/schema/wallets"
import { z } from "zod"

export interface Wallet {
  id: number
  name: string
  balance: number
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