import { createWorkDaySchema } from "@/schema/work-days";
import { z } from "zod";

export interface WorkDay {
  id: number;
  date: string;

  created_at: string;
  updated_at: string;
}

export type CreateWorkDay = z.infer<typeof createWorkDaySchema>

export type CreateWorkDayData = {
  date: string;
  data: {
    man_id: number;
    extra_hours?: number;
  }[]
}

export interface GetAllWorkResponse {
  success: boolean
  data: WorkDay[]
}