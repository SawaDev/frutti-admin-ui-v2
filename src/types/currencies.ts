import { currencySchema } from "@/schema/currencies"
import { z } from "zod"

export interface Currency {
  id: number
  name: string
  distribution: number
  symbol?: string | null
  created_at: string
}

export interface GetAllCurrenciesResponse {
  success: boolean
  data: Currency[]
}

export interface GetSingleCurrencyResponse {
  success: boolean
  data: Currency
}

export type CurrencyType = z.infer<typeof currencySchema>

export type UpdateCurrencyType = Omit<CurrencyType, 'balance'>