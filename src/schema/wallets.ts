import { z } from "zod";

export const walletSchema = z.object({
  name: z.string({ required_error: "Nomi ni kiriting!" }).min(1, "Nomi 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  balance: z.number({ required_error: "Balans ni kiriting!" })
})

export const updateWalletSchema = z.object({
  name: z.string({ required_error: "Nomi ni kiriting!" }).min(1, "Nomi 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
})
export const createExchangeSchema = z.object({

  from_wallet_id: z.string({ required_error: "Hamyonni tanlang!" }),
  to_wallet_id: z.string({ required_error: "Hamyonni tanlang!" }),
  amount: z.number({ required_error: "O'tkazma summasini kiriting!" }),
  distribution: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
})