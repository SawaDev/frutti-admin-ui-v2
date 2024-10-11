import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string({ required_error: "Ismi ni kiriting!" }).min(1, "Ism 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  balance: z.number({ required_error: "Balans ni kiriting!" }),
  currency: z.string({ required_error: "Pul birligini tanlang!" })
})

export const updateClientSchema = z.object({
  name: z.string({ required_error: "Ismi ni kiriting!" }).min(1, "Ism 1 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
})