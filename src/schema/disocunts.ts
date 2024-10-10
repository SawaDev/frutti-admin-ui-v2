import { z } from "zod";

export const createDiscountSchema = z.object({
  client_id: z.string({ required_error: "Klientni tanlang!" }),

  value: z.number({ required_error: "Chegirma miqdorini kiriting!" }),
  type: z.enum(["percentage", "amount"], {
    required_error: "Chegirma turini tanlang!",
  }),

  from_date: z.string().optional(),
  to_date: z.string().optional(),
});
