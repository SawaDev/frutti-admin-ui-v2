import { z } from "zod";

export const createIngredientSchema = z.object({
  warehouse_id: z.string({ required_error: "Sklad ni tanlang!" }),
  name: z.string({ required_error: "Siryo nomini kiriting!" }),
  category: z.string({ required_error: "Kategoriyani kiriting!" }),
  quantity: z.number({ required_error: "Siryo miqdorini kiriting!" }),
  unit: z.string({ required_error: "Birligini kiriting!" }),
  cost: z.number({ required_error: "Narxini kiriting!" }),
  bag_distribution: z.number().optional(),
})

export const ingredientPurchaseSchema = z.object({
  total_cost: z.number({ required_error: "Narxini kiriting!" }),
  shipping_cost: z.number().optional(),
  fee: z.number().optional(),
  ingredients: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      cost_per_unit: z.number()
    })
  )
})