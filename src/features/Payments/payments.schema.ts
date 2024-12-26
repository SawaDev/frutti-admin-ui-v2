import { z } from "zod";

export const createPaymentSchema = z.object({
  data: z.array(
    z.object({
      woman_id: z.number({ required_error: "Ayolni ni tanlang!" }).optional(),
      man_id: z.number({ required_error: "Erkakni ni tanlang!" }).optional(),
      amount_paid: z.number().optional(),
      bonus_amount: z.number().optional(),
    }),
  ),
  date: z.string({ required_error: "Sana kiriting!" }),
  comment: z.string().optional(),
});

export const updatePaymentSchema = z.object({
  amount_paid: z.number({ required_error: "To'lov miqdorini kiriting!" }).optional(),
});
