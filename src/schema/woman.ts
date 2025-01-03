import { z } from "zod";

export const createWomanSchema = z.object({
  name: z.string({ required_error: "Ismini kiriting!" }),
  balance: z.number({ required_error: "Balansni kiriting!" }),
  work_place: z.string({ required_error: "Ish joyini kiriting!" }),
})

export const updateWomanSchema = z.object({
  name: z.string().optional(),
  balance: z.number().optional()
})

export const womanProductsSchema = z.object({
  date: z.string().nullable(),
  women: z.array(
    z.object({
      woman_id: z.number({ required_error: "Ayolni kiriting!" }),
      products: z.array(
        z.object({
          product_id: z.number({ required_error: "Productni kiriting!" }),
          quantity: z.number().optional()
        })
      )
    })
  )
})