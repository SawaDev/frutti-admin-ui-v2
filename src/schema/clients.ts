import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string({ required_error: "Ismi ni kiriting!" }).min(2, "Ism 2 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  balance: z.number({ required_error: "Balans ni kiriting!" })
})

export const updateClientSchema = z.object({
  name: z.string({ required_error: "Ismi ni kiriting!" }).min(2, "Ism 2 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
})