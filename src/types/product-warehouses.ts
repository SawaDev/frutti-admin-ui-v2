import { createProductWarehouseSchema } from "@/schema/product-warehouses";
import { z } from "zod";
import { Product } from "./products";

export interface ProductWarehouse {
  id: number;

  name: string;

  products?: Product[]

  created_at: string;
  updated_at: string;
}

export interface GetAllProductWarehousesResponse {
  success: boolean
  data: ProductWarehouse[]
}

export interface GetSingleProductWarehouseResponse {
  success: boolean
  data: ProductWarehouse
}

export type CreateProductWarehouse = z.infer<typeof createProductWarehouseSchema>