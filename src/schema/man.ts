import { z } from "zod";

export const createManSchema = z.object({
  name: z.string({ required_error: "Ismini kiriting!" }),
  balance: z.number({ required_error: "Balansni kiriting!" }),
  hours_per_day: z.number({ required_error: "Kunlik ish soatini kiriting!" }).optional(),
  payment_per_day: z.number({ required_error: "Kunlik ish haqini kiriting!" }).optional(),
  payment_per_product: z.number({ required_error: "Mahsulot haqini kiriting!" }).optional(),
  payment_per_month: z.number({ required_error: "Oylik ish haqini kiriting!" }).optional(),
  salary_type: z.enum(["monthly", "daily", "by_product"], { required_error: "To'lov turini tanlang!" }),
  is_bonus_available: z.string().optional()
})

export const updateManSchema = z.object({
  name: z.string().optional(),
  balance: z.number().optional(),
  hours_per_day: z.number().optional(),
  payment_per_day: z.number().optional(),
  payment_per_product: z.number().optional(),
  payment_per_month: z.number().optional(),
  salary_type: z.enum(["monthly", "daily", "by_product"]).optional()
})
