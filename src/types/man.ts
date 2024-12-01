import { z } from "zod"
import { WorkDay } from "./work-days"
import { createManSchema, updateManSchema } from "@/schema/man"

export interface ExtendedWorkDay extends WorkDay {
  man: Man
  extra_hours: number
}

export interface Man {
  id: number
  name: string
  balance: number
  status: "working" | "in_holiday",
  hours_per_day: number;
  payment_per_hour: number;
  salary_type: "monthly" | "daily" | "by_product";

  work_days: ExtendedWorkDay[]

  created_at: string
  updated_at: string
}

export interface GetAllMenResponse {
  success: boolean
  data: Man[]
}

export interface GetSingleManResponse {
  success: boolean
  data: Man
}

export type CreateManType = z.infer<typeof createManSchema>

export type UpdateManType = z.infer<typeof updateManSchema>