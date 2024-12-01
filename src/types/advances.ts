import { z } from "zod"
import { Man } from "./man"
import { Woman } from "./woman"
import { createAdvanceSchema, updateAdvanceSchema } from "@/schema/advances";

export interface Advance {
  id: number;
  woman_id: number | null;
  man_id: number | null;

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

export interface GetAllAdvancesResponse {
  success: boolean
  data: Advance[]
}

export type CreateAdvanceType = z.infer<typeof createAdvanceSchema>

export type UpdateAdvanceType = z.infer<typeof updateAdvanceSchema>