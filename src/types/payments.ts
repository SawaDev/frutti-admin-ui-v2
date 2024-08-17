import { z } from "zod"
import { Woman } from "./woman"
import { createPaymentSchema } from "@/schema/payments"

export interface Payment {
  id: number
  woman_id: number
  amount_paid: number
  comment?: string | null

  woman?: Woman

  created_at: string
  updated_at: string
}

export interface GetAllPaymentsResponse {
  success: boolean
  data: Payment[]
}

export interface GetSinglePaymentResponse {
  success: boolean
  data: Payment
}

export type CreatePaymentType = z.infer<typeof createPaymentSchema>