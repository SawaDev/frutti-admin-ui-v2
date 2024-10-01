import { createWarehouseSchema } from "@/schema/warehouses";
import { z } from "zod";
import { Ingredient } from "./ingredients";

export interface Warehouse {
  id: number;

  name: string;
  created_at: string;

  ingredients?: Ingredient[]
}

export interface GetAllWarehousesResponse {
  success: boolean
  data: Warehouse[]
}

export interface GetSingleWarehouseResponse {
  success: boolean
  data: Warehouse
}

export type CreateWarehouse = z.infer<typeof createWarehouseSchema>