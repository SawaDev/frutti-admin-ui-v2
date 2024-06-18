import { z } from "zod";

export const currencySchema = z.object({
  name: z.string({ required_error: "Nomi ni kiriting!" }).min(1, "Nomi 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  distribution: z.number({ required_error: "Qiymatini ni kiriting!" }).min(0, "Qiymati 0 dan katta bo'lishi kerak!"),
  symbol: z.string().nullable()
})