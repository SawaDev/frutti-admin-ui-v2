import { createIngredientSchema, ingredientPurchaseSchema, ingredientTransactionSchema } from "@/schema/ingredients";
import { z } from "zod";
import { Warehouse } from "./warehouses";

export interface IngredientCategory {
  id: number;
  name: string;
  children_ids: number[];
  parent_ids: number[];

  created_at: string;
  updated_at: string;
}

export interface Ingredient {
  id: number;
  warehouse_id: number;
  category_id: number;

  category?: IngredientCategory;
  warehouse?: Warehouse;

  name: string;
  quantity: number;
  unit: 'kg' | 'count' | 'gr';
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

export type CreateIngredientPurchaseType = {
  total_cost: number;
  ingredients: {
    id: number;
    quantity: number;
    space: number | null;
    cost_per_unit: number;
  }[]
}

export type UpdateIngredientPurchaseType = {
  status: string
  ingredients: {
    id: number;
    cost_per_unit: number;
  }[]
}

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
    status: "finished" | "waiting" | "on_way"

    ingredients: ExtendedIngredient[]
    totals: {
      cost: number
      count?: number
      kg?: number
      gr?: number
    }
  }[]
}

export interface IngredientPurchasesQueryParams {
  status: "finished" | "waiting" | "on_way"
  from_date: string
  to_date: string
}

export type CreateIngredientTransaction = z.infer<typeof ingredientTransactionSchema>

export type ExtendedTransactionIngredient = Ingredient & {
  transaction_quantity: number
  transaction_cost: number
}

export interface GetAllIngredienTransactionsResponse {
  success: boolean
  data: {
    id: number
    category?: string
    comment?: string

    created_at: string
    updated_at: string

    totals: {
      cost: number
      count?: number
      kg?: number
      gr?: number
    }

    ingredients: ExtendedTransactionIngredient[]
  }[]
}

export interface IngredientCategory {
  id: number
  name: string

  created_at: string
  updated_at: string

  ingredients: Ingredient[]
}

export interface GetAllIngredientCategories {
  success: boolean
  data: IngredientCategory[]
}