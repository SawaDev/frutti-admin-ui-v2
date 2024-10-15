import { z } from "zod";

export const createSaleSchema = z.object({
  wallet_id: z.string({ required_error: "Kassani ni tanlang!" }),
  client_id: z.string().nullable(),
  transaction_type: z.string({ required_error: "To'lov turini kiriting!" }),
  payment_received: z.number({ required_error: "Summani kiriting!" }),
  distribution: z.number().optional(),
  currency_name: z.string().optional(),
  is_free: z.string(),
  date: z.string().optional(),
  status: z.enum(["finished", "waiting"]).optional(),
  products: z.array(
    z
      .object({
        product_id: z.number().optional(),
        quantity: z.number().optional(),
        price: z.number().optional(),
      })
      .optional(),
  ),
});
