import { Man } from "@/types/man"
import { createMonthlyPaymentSchema } from "./monthlyPayment.schema"
import { z } from "zod"

export type MonthlyPayment = {
  id: number
  man_id: number | null
  amount: number
  man_before: Man
}

export type GetMonthlyPaymentsResponse = {
  success: boolean
  data: {
    date: string
    total_amount: number
    payments: MonthlyPayment[]
  }[]
}

export type CreateMonthlyPaymentType = z.infer<typeof createMonthlyPaymentSchema>