import { z } from "zod";

export const createWomanSchema = z.object({
  name: z.string({ required_error: "Ismini kiriting!" }),
  balance: z.number({ required_error: "Balansni kiriting!" }),
})

export const updateWomanSchema = z.object({
  name: z.string().optional(),
  balance: z.number().optional(),
})