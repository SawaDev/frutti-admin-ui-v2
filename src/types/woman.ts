import { createWomanSchema, updateWomanSchema } from "@/schema/woman"
import { z } from "zod"
import { Product } from "./products"

type ExtendedProduct = Product & {
  quantity: string
  production_cost: string
}

export interface Woman {
  id: number
  name: string
  balance: number
  status: "working" | "in_holiday"
  work_place: string

  products: ExtendedProduct[]

  created_at: string
  updated_at: string
}

export interface GetAllWomenResponse {
  success: boolean
  data: Woman[]
}

export interface GetSingleWomanResponse {
  success: boolean
  data: Woman
}

export type CreateWomanType = z.infer<typeof createWomanSchema>

export type UpdateWomanType = z.infer<typeof updateWomanSchema>