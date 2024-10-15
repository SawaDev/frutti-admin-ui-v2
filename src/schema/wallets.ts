import { z } from "zod";

export const walletSchema = z.object({
  name: z
    .string({ required_error: "Nomi ni kiriting!" })
    .min(1, "Nomi 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  balance: z.number({ required_error: "Balans ni kiriting!" }),
  type: z.enum(["dollar", "sum"], {
    required_error: "Kassa valyutasini tanlang!",
  }),
});

export const updateWalletSchema = z.object({
  name: z
    .string({ required_error: "Nomi ni kiriting!" })
    .min(1, "Nomi 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
});
export const createExchangeSchema = z.object({
  from_wallet_id: z.string({ required_error: "Kassani tanlang!" }),
  to_wallet_id: z.string({ required_error: "Kassani tanlang!" }),
  amount: z.number({ required_error: "O'tkazma summasini kiriting!" }),
  distribution: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
});
