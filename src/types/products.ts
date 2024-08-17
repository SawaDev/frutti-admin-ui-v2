import { z } from "zod";
import { ProductWarehouse } from "./product-warehouses";
import { createProductSchema } from "@/schema/products";

export interface Product {
  id: number;
  warehouse_id: number;

  name: string;
  quantity: number;
  price: number;
  price_in_dollar: number;
  average_price: number;
  pure_price: number;
  production_cost: number
  bag_distribution?: number | null;

  warehouse?: ProductWarehouse

  created_at: string;
  updated_at: string;
}

export interface GetAllProductsResponse {
  success: boolean;
  data: Product[];
}

export interface GetSingleProductResponse {
  success: boolean;
  data: Product;
}

export type CreateProductType = z.infer<typeof createProductSchema>