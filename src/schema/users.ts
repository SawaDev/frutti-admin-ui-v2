import { z } from "zod";

export const userSchema = z.object({
  user_name: z.string({ required_error: "Username ni kiriting!" }).min(6, "Username 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  password: z.string({ required_error: "Parol ni kiriting!" }).min(6, "Parol 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  password_again: z.string({ required_error: "Takroriy parol ni kiriting!" }).min(6, "Parol 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
  permissions: z.array(z.string())
})

// export const userWithoutPasswordSchema = z.object({
//   user_name: z.string({ required_error: "Username ni kiriting!" }).min(6, "Username 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
//   password: z.string({ required_error: "Parol ni kiriting!" }).min(6, "Parol 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
//   password_again: z.string({ required_error: "Takroriy parol ni kiriting!" }).min(6, "Parol 6 yoki undan ko'p xarfdan iborat bo'lishi kerak!"),
//   permissions: z.array(z.string())
// })