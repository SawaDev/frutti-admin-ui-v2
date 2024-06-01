import { copySchema, detailSchema, postSchema } from "@/schema/posts";
import { z } from "zod";

export interface Localized {
  uz: string
  ru: string
  en: string
}

export interface Details {
  id: string
  name: Localized
  image: string
  capacity: Localized
  mass?: number
  pure_mass?: number
  total_mass?: number
  expiration_date?: number
  volume?: string
  published: boolean
}

export interface GetAllPostsResponse {
  success: boolean
  data: {
    id: number
    name: Localized
    description: Localized
    published: boolean
    created_at: string
  }[]
}

export interface GetSinglePostResponse {
  success: boolean
  data: {
    id: number
    name: Localized
    description: Localized
    published: boolean
    created_at: string
    details: Details[]
  }
}

export type PostType = z.infer<typeof postSchema> 
export type DetailType = z.infer<typeof detailSchema> 
export type CopyType = z.infer<typeof copySchema> 