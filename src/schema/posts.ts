import { z } from "zod";

export const detailSchema = z.object({
  id: z.string().optional(),
  name: z.object({
    uz: z.string({ required_error: "O'zbek tilidagi nomini kiriting" }),
    ru: z.string({ required_error: "Rus tilidagi nomini kiriting" }),
    en: z.string({ required_error: "Ingliz tilidagi nomini kiriting" }),
  }),
  image: z.string({ required_error: 'Post rasmini yuklang' }),
  capacity: z.object({
    uz: z.string().optional(),
    ru: z.string().optional(),
    en: z.string().optional(),
  }).optional(),
  mass: z.number().optional(),
  pure_mass: z.number().optional(),
  total_mass: z.number().optional(),
  expiration_date: z.number().optional(),
  volume: z.string().optional(),
  published: z.boolean(),
})

export const postSchema = z.object({
  name: z.object({
    uz: z.string({ required_error: "Produktning o'zbek tilidagi nomini kiriting" }),
    ru: z.string({ required_error: "Produktning rus tilidagi nomini kiriting" }),
    en: z.string({ required_error: "Produktning ingliz tilidagi nomini kiriting" }),
  }),
  description: z.object({
    uz: z.string().min(1, {
      message: "Produkt haqida o'zbek tilidagi ma'lumotni kiriting",
    }),
    ru: z.string().min(1, {
      message: "Produkt haqida rus tilidagi ma'lumotni kiriting",
    }),
    en: z.string().min(1, {
      message: "Produkt haqida ingliz tilidagi ma'lumotni kiriting",
    }),
  }),
  published: z.boolean(),
  details: z.array(
    z.object({
      id: z.number(),
      image: z.string().nullable(),
      capacity: z.object({
        uz: z.string({ required_error: "O'zbek tilidagi sig'imini kiriting" }),
        ru: z.string({ required_error: "Rus tilidagi sig'imini kiriting" }),
        en: z.string({ required_error: "Ingliz tilidagi sig'imini kiriting" }),
      }),
      mass: z.number().nullable().optional(),
      pure_mass: z.number().nullable().optional(),
      total_mass: z.number().nullable().optional(),
      expiration_date: z.number().nullable().optional(),
      volume: z.string().nullable().optional(),
      published: z.boolean().nullable().optional(),
      name: z.object({
        uz: z.string().min(1, {
          message: "O'zbek tilidagi nomini kiriting",
        }),
        ru: z.string().min(1, {
          message: "Rus tilidagi nomini kiriting",
        }),
        en: z.string().min(1, {
          message: "Ingliz tilidagi nomini kiriting",
        }),
      }),
    }).optional()
  ).optional()
});

export const copySchema = z.object({
  count: z
    .number({ required_error: "Nusxalar sonini kiriting!" })
    .min(1, {message: "Nusxalar sonini kamida 1 ta bo'lishi kerak!"})
    .max(10, {message: "Nusxalar sonini ko'pi bilan 10 ta bo'la oladi!"})
});