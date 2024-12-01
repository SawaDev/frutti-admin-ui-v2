import { z } from "zod";

export const createPaymentSchema = z.object({
  data: z.array(
    z.object({
      woman_id: z.string({ required_error: "Ayolni ni tanlang!" }),
      product_id: z.string({ required_error: "Mahsulotni kiriting!" }),
      amount: z.number({ required_error: "To'lov miqdorini kiriting!" }),
    }),
  ),
  comment: z.string().optional(),
});
