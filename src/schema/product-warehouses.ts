import { z } from "zod";

export const createProductWarehouseSchema = z.object({
  name: z.string({ required_error: "Sklad nomini kiriting!" })
})