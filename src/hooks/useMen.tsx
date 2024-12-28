import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import {
  CreateManData,
  GetAllMenResponse,
  GetSingleManResponse,
  UpdateManType,
} from "@/types/man";
import { convertToQueryString } from "@/lib/utils";

const useMen = () => {
  const queryClient = useQueryClient();

  const createMenMutation = () =>
    useMutation({
      mutationFn: async (data: CreateManData) => {
        try {
          const response = await api.post("/men", data);
          return response.data;
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["men"] });
      },
    });

  const getAllMenQuery = (data: { salary_type?: string }) =>
    useQuery<GetAllMenResponse, Error>({
      queryKey: ["men", data?.salary_type],
      queryFn: async () => {
        try {
          const response = await api.get(`/men${convertToQueryString(data)}`);

          return structuredClone(response.data);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
    });

  const getSingleManQuery = (id: string | undefined) =>
    useQuery<GetSingleManResponse, Error>({
      queryKey: ["men", id],
      queryFn: async () => {
        try {
          const response = await api.get(`/men/${id}`);

          return structuredClone(response.data);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
    });

  const updateManMutation = (id: string | undefined) =>
    useMutation<GetSingleManResponse, AxiosError, UpdateManType, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.patch(`/men/${id}`, data);
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli saqlandi!",
            });
          }
          return response.data;
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["men", id] });
        queryClient.invalidateQueries({ queryKey: ["men"] });
      },
    });

  const deleteManMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/men/${id}`);
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli o'chirildi!",
            });
          }
          return response.data;
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["men"] });
      },
    });

  return {
    createMenMutation,
    getAllMenQuery,
    getSingleManQuery,
    updateManMutation,
    deleteManMutation,
  };
};

export default useMen;
