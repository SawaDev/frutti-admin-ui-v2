import { z } from "zod"
import { createDiscountSchema } from "@/schema/disocunts"
import { Client } from "./clients"

export interface Discount {
  id: number
  client_id?: number | null

  type: "percentage" | "amount";
  value: number;

  balance_before: number | null;
  balance_after: number | null;

  client?: Client

  created_at: string;
  updated_at: string;
}

export interface GetAllDiscountsResponse {
  success: boolean
  data: Discount[]
}

export type CreateDiscountType = z.infer<typeof createDiscountSchema>