import { createWarehouseSchema } from "@/schema/warehouses";
import { z } from "zod";

export interface Warehouse {
  id: number;

  name: string;
  created_at: string;
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