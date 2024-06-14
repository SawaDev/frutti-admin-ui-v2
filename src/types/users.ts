import { userSchema } from "@/schema/users"
import { z } from "zod"

export interface GetAllUsersResponse {
  success: boolean
  data: {
    id: number
    user_name: string
    permissions: string[]
    created_at: string
  }[]
}

export interface GetSingleUserResponse {
  success: boolean
  data: {
    id: number
    user_name: string
    permissions: string[]
    created_at: string
  }
}

export type UserType = z.infer<typeof userSchema>