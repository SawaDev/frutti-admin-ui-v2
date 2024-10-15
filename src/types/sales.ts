import { z } from "zod";
import { Client } from "./clients";
import { createSaleSchema } from "@/schema/sales";
import { Product } from "./products";
import { Transaction } from "./transactions";

export type ExtendedProduct = Product & {
  sale_quantity: number;
  sale_price: number;
  sale_distribution: number | null;
};

export interface Sale {
  id: number;
  client_id: number;
  total_price: number;
  distribution: number | null;
  currency_name: string | null;
  is_free: boolean;
  date?: string;
  status: "finished" | "waiting"

  client?: Client;
  products?: ExtendedProduct[];
  transaction?: Transaction;

  created_at: string;
  updated_at: string;
}

export interface GetAllSalesResponse {
  success: boolean;
  data: Sale[];
}

export interface GetSingleSaleResponse {
  success: boolean;
  data: Sale;
}

export type CreateSaleType = z.infer<typeof createSaleSchema>;

export type CreateSaleDataType = Omit<
  CreateSaleType,
  "wallet_id" | "client_id" | "is_free"
> & {
  is_free: boolean;
  wallet_id: number;
  client_id: number;
};
