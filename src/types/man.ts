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
  hours_per_day?: number;
  payment_per_day?: number;
  payment_per_product?: number;
  payment_per_month?: number;
  salary_type: "monthly" | "daily" | "by_product";
  is_bonus_available: boolean;

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

export type CreateManData = {
  name: string;
  balance: number;
  hours_per_day?: number;
  payment_per_day?: number;
  salary_type: "monthly" | "daily" | "by_product";
  is_bonus_available?: boolean;
}

export type UpdateManType = z.infer<typeof updateManSchema>