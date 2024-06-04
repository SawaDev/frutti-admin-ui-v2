import { authSchema } from "@/schema/auth"
import { z } from "zod"

export interface AuthStore {
  user_name: string | null
  permissions: string[]
  token: string | null

  login: (user_name: string, permissions: string[], token: string) => void
  logout: () => void
}

export type AuthType = z.infer<typeof authSchema>

export interface AuthResponse {
  success: boolean
  data: {
    user_name: string
    permissions: string[]
    created_at: string
    token: string
  }
}