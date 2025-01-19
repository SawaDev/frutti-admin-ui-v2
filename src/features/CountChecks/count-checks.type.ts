import { createCountCheckSchema } from "./count-check.schame"
import { z } from "zod"

export interface CountCheckParams {
  date: string;
  item_type: "product" | "ingredient";
}

export type CountCheck = {
  id: number
  item_id: number
  item_type: string // product or ingredient
  name: string
  date: string
  actual_quantity: number
  expected_quantity: number
  total_price: number
  status: "pending" | "done"
}

export type GetCountChecksResponse = {
  success: boolean
  data: {
    date: string
    status: "pending" | "done"
    item_type: "product" | "ingredient"
    count_checks: CountCheck[]
  }[]
}

export type CreateCountCheckType = z.infer<typeof createCountCheckSchema>