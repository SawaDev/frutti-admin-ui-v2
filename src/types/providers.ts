import { z } from "zod"
import { createProviderSchema } from "@/schema/providers";

export interface Provider {
  id: number;
  name: string;
  balance: number;
  currency: string | null;

  created_at: string
  updated_at: string
}

export interface GetAllProvidersResponse {
  success: boolean
  data: Provider[]
}

export type CreateProviderType = z.infer<typeof createProviderSchema>