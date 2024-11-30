import { z } from "zod"
import { createFeeSchema, updateFeeSchema } from "@/schema/fees"
import { Man } from "./man";
import { Woman } from "./woman";

export interface Fee {
  id: number;
  woman_id: number | null;
  man_id: number | null;

  amount: number;
  comment?: string | null;

  balance_before: number;
  balance_after: number;

  man?: Man
  woman?: Woman

  created_at: string;
  updated_at: string;
}

export interface GetAllFeesResponse {
  success: boolean
  data: Fee[]
}

export type CreateFeeType = z.infer<typeof createFeeSchema>

export type UpdateFeeType = z.infer<typeof updateFeeSchema>