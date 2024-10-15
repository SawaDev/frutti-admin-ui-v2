import { z } from "zod";

export const transactionSchema = z.object({
  wallet_id: z.string({ required_error: "Kassani ni tanlang!" }),
  client_id: z.string().nullable(),
  type: z.string({ required_error: "To'lov turini kiriting!" }),
  amount: z.number({ required_error: "To'lov miqdorini kiriting!" })
})