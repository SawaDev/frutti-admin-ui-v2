import { z } from "zod";

export const createMonthlyPaymentSchema = z.object({
  data: z.array(
    z.object({
      man_id: z.number({ required_error: "Erkakni kiriting!" }),
      amount: z.number().optional(),
    })
  ),
  date: z.string({ required_error: "Kunni kiriting!" })
})