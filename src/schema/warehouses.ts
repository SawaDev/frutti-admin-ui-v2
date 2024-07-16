import { z } from "zod";

export const createWarehouseSchema = z.object({
  name: z.string({ required_error: "Sklad nomini kiriting!" })
})