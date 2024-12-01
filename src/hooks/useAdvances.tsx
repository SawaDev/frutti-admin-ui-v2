import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateAdvanceType, GetAllAdvancesResponse } from "@/types/advances";
import { AxiosError } from "axios";

const useAdvances = () => {
  const queryClient = useQueryClient();

  const createAdvanceMutation = () =>
    useMutation({
      mutationFn: async (data: CreateAdvanceType) => {
        const response = await api.post("/advances", data);
        return response.data;
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error?.response?.data?.message,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["advances"] });
        queryClient.invalidateQueries({ queryKey: ["men"] });
        queryClient.invalidateQueries({ queryKey: ["women"] });
      },
    });

  const getAllAdvancesQuery = () =>
    useQuery<GetAllAdvancesResponse, Error>({
      queryKey: ["advances"],
      queryFn: async () => {
        const response = await api.get(`/advances`);
        return structuredClone(response.data);
      },
    });

  const updateAdvanceMutation = (id: number | undefined) =>
    useMutation<any, AxiosError, any, () => void>({
      mutationFn: async (data) => {
        const response = await api.put(`/advances/${id}`, data);
        if (response?.data) {
          toast({
            description: "Muvaffaqiyatli saqlandi!",
          });
        }
        return response.data;
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error?.response?.data?.message,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["advances"] });
      },
    });

  const deleteAdvanceMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        const response = await api.delete(`/advances/${id}`);
        if (response?.data) {
          toast({
            description: "Muvaffaqiyatli o'chirildi!",
          });
        }
        return response.data;
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error?.response?.data?.message,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["advances"] });
        queryClient.invalidateQueries({ queryKey: ["men"] });
        queryClient.invalidateQueries({ queryKey: ["women"] });
      },
    });

  return {
    createAdvanceMutation,
    getAllAdvancesQuery,
    deleteAdvanceMutation,
    updateAdvanceMutation,
  };
};

export default useAdvances;
