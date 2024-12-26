import { z } from "zod"
import { Woman } from "../../types/woman"
import { createPaymentSchema } from "./payments.schema"
import { Man } from "@/types/man"

export interface Payment {
  id: number
  woman_id: number
  amount_paid: number
  date: string
  comment?: string | null

  woman?: Woman
  man?: Man

  created_at: string
  updated_at: string
}

export interface GetAllPaymentsParams {
  from_date?: string
  to_date?: string
  gender?: string
  salary_type?: string
}

export interface EditPaymentType {
  amount_paid?: number
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