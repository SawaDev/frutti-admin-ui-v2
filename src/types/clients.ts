import { createClientSchema } from "@/schema/clients"
import { z } from "zod"

export interface Client {
  id: number
  name: string
  balance: number
  created_at: string
}

export interface GetAllClientsResponse {
  success: boolean
  data: Client[]
}

export interface GetSingleClientResponse {
  success: boolean
  data: Client
}

export type ClientType = z.infer<typeof createClientSchema>

export type UpdateClientType = Omit<ClientType, "balance">