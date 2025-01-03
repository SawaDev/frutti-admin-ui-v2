import { createCountCheckSchema } from "./count-check.schame"
import { z } from "zod"

export type CountCheck = {
  id: number
  item_id: number
  item_type: string // product or ingredient
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
    count_checks: CountCheck[]
  }[]
}

export type CreateCountCheckType = z.infer<typeof createCountCheckSchema>