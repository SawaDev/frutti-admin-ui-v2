import { z } from "zod";

export const createCountCheckSchema = z.object({
  data: z.array(
    z.object({
      item_id: z.number({ required_error: "Mahsulotni kiriting!" }).optional(),
      actual_quantity: z.number({ required_error: "Miqdorni kiriting!" }).optional(),
      total_price: z.number({ required_error: "Narxi kiriting!" }).optional(),
    })
  ),
  item_type: z.enum(["product", "ingredient"]),
  status: z.enum(["pending", "done"]),
  date: z.string({ required_error: "Kunni kiriting!" })
})