import { z } from "zod";

export const createProductSchema = z.object({
  warehouse_id: z.string({ required_error: "Sklad ni tanlang!" }),
  name: z.string({ required_error: "Nomini kiriting!" }),
  quantity: z.number({ required_error: "Miqdorini kiriting!" }),
  price: z.number({ required_error: "Narxini kiriting!" }),
  price_in_dollar: z.number({ required_error: "Dollardagi narxini kiriting!" }),
  pure_price: z.number({ required_error: "Tan narxini kiriting!" }),
  production_cost: z.number({ required_error: "Ishlab chiqarish narxini kiriting!" }),
  man_sale_cost: z.number({ required_error: "Erkaklar sotuvdan ulush summasini kiriting!" }),
  home_production_cost: z.number({ required_error: "Uyda ishlab chiqarish narxini kiriting!" }),
  bag_distribution: z.number().optional(),
})