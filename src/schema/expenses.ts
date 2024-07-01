import { z } from "zod";

export const expenseSchema = z.object({
  wallet_id: z.string({ required_error: "Hamyonni ni tanlang!" }),
  category_id: z.string().nullable(),
  amount: z.number({ required_error: "To'lov miqdorini kiriting!" }),
  comment: z.string().nullable().optional(),
})

export const expenseCategorySchema = z.object({
  name: z.string({ required_error: "Kategoriya nomini kiriting!" })
})