import { z } from "zod";

export const createFeeSchema = z.object({
  amount: z.number({ required_error: "Summani kiriting!" }),
  comment: z.string().optional(),
  
  man_id: z.string().optional(),
  woman_id: z.string().optional(),  
})