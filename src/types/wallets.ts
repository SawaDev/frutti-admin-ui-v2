import { walletSchema } from "@/schema/wallets"
import { z } from "zod"

interface Wallet {
  id: number
  name: string
  balance: number
  created_at: string
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

export type WalletWithoutPassword = Omit<WalletType, 'password_again'>