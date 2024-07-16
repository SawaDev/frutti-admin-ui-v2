import { createIngredientSchema, ingredientPurchaseSchema } from "@/schema/ingredients";
import { z } from "zod";

export interface Ingredient {
  id: number;
  warehouse_id: number;

  name: string;
  quantity: number;
  unit: 'kg' | 'count' | 'gr';
  category: string;
  average_cost: number;
  cost: number;
  bag_distribution?: number | null;

  created_at: string;
}

export interface GetAllIngredientsResponse {
  success: boolean
  data: Ingredient[]
}

export interface GetSingleIngredientResponse {
  success: boolean
  data: Ingredient
}

export type CreateIngredient = z.infer<typeof createIngredientSchema>

export type IngredientPurchaseType = z.infer<typeof ingredientPurchaseSchema>

export type ExtendedIngredient = Ingredient & {
  updated_at: string;
  purchase_quantity: number;
  purchase_cost_per_unit: number;
}

export interface GetAllIngredientPurchasesTypeResponse {
  success: boolean
  data: {
    id: number
    total_cost: number
    shipping_cost: number | null
    fee: number | null
    created_at: string
    updated_at: string

    ingredients: ExtendedIngredient[]
    totals: {
      cost: number
      count?: number
      kg?: number
      gr?: number
    }
  }[]
}