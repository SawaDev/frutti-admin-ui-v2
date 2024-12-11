import { z } from "zod";

export const createWorkDaySchema = z.object({
  data: z.array(
    z.object({
      man_id: z.number({ required_error: "Erkakni kiriting!" }),
      extra_hours: z.number().optional(),
      checked: z.boolean().optional()
    })
  ),
  date: z.string({ required_error: "Kunni kiriting!" })
})

export const createMonthlyPaymentSchema = z.object({
  data: z.array(
    z.object({
      man_id: z.number({ required_error: "Erkakni kiriting!" }),
      amount: z.number({ required_error: "Miqdorni kiriting!" }),
    })
  ),
  date: z.string({ required_error: "Kunni kiriting!" })
})