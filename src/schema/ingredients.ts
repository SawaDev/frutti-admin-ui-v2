import { z } from "zod";

export const createIngredientSchema = z.object({
  warehouse_id: z.string({ required_error: "Sklad ni tanlang!" }),
  name: z.string({ required_error: "Siryo nomini kiriting!" }),
  category_id: z.string({ required_error: "Kategoriyani kiriting!" }),
  quantity: z.number({ required_error: "Siryo miqdorini kiriting!" }),
  unit: z.string({ required_error: "Birligini kiriting!" }),
  cost: z.number({ required_error: "Narxini kiriting!" }),
  bag_distribution: z.number().optional(),
});

export const ingredientPurchaseSchema = z.object({
  total_cost: z.number({ required_error: "Narxini kiriting!" }),
  status: z.string({ required_error: "Statusni kiriting!" }),
  purchased_from: z.string({ required_error: "Qayerdan olinganini kiriting!" }),
  provider_id: z.string({ required_error: "Yetkazib beruvchini kiriting!" }),
  ingredients: z.array(
    z.array(
      z.object({
        id: z.number(),
        quantity: z.number(),
        space: z.number(),
        cost_per_unit: z.number(),
        shipping_price: z.number(),
      }),
    ),
  ),
});

export const ingredientTransactionSchema = z.object({
  date: z.string({ required_error: "Sana kiriting!" }),
  comment: z.string().optional(),
  ingredients: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
    }),
  ),
});

export const updateIngredientPurchaseSchema = z.object({
  status: z.string({ required_error: "Statusni kiriting!" }),
  ingredients: z.array(
    z.object({
      id: z.number(),
      cost_per_unit: z.number(),
    }),
  ),
});
