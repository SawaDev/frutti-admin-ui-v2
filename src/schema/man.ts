import { z } from "zod";

export const createManSchema = z.object({
  name: z.string({ required_error: "Ismini kiriting!" }),
  balance: z.number({ required_error: "Balansni kiriting!" }),
  hours_per_day: z.number({ required_error: "Kunlik ish soatini kiriting!" }),
  payment_per_hour: z.number({ required_error: "Soatlik ish haqini kiriting!" })
})

export const updateManSchema = z.object({
  name: z.string().optional(),
  balance: z.number().optional(),
  hours_per_day: z.number().optional(),
  payment_per_hour: z.number().optional()
})