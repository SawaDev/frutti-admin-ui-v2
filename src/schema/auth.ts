import { z } from "zod";

export const authSchema = z.object({
  user_name: z.string({ required_error: "Username ni kiriting!" }).min(6, "Username 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  password: z.string({ required_error: "Password ni kiriting!" }).min(6, "Parol 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
})