import { z } from "zod";

export const createProviderSchema = z.object({
  name: z.string({ required_error: "Ismni kiriting!" }),
  balance: z.number({ required_error: "Balansni kiriting!" }),
  currency: z.string().optional(),
})