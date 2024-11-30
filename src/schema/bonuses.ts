import { z } from "zod";

export const createBonusSchema = z.object({
  method: z.string({ required_error: "To'lov turini kiriting!" }),
  amount: z.number({ required_error: "Summani kiriting!" }),
  type: z.string().optional(),
  comment: z.string().optional(),
  
  man_id: z.string().optional(),
  woman_id: z.string().optional(),  
})

export const updateBonusSchema = z.object({
  amount: z.number({ required_error: "Summani kiriting!" }),
})