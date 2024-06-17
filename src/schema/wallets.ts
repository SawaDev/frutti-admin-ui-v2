import { z } from "zod";

export const walletSchema = z.object({
  name: z.string({ required_error: "Nomi ni kiriting!" }).min(1, "Nomi 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  balance: z.number({ required_error: "Balans ni kiriting!" })
})