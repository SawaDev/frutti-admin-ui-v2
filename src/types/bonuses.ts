import { z } from "zod"
import { createBonusSchema } from "@/schema/bonuses"
import { Man } from "./man"
import { Woman } from "./woman"

export interface Bonus {
  id: number
  woman_id?: number | null
  man_id?: number | null

  type: string | null;
  method: "cash" | "card";
  amount: number;
  comment?: string | null;

  balance_before: number;
  balance_after: number;

  man?: Man
  woman?: Woman

  created_at: string;
  updated_at: string;
}

export interface GetAllBonusesResponse {
  success: boolean
  data: Bonus[]
}

export type CreateBonusType = z.infer<typeof createBonusSchema>