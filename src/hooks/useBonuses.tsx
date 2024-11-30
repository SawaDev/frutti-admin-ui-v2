import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateBonusType, GetAllBonusesResponse } from "@/types/bonuses";
import { AxiosError } from "axios";

const useBonuses = () => {
  const queryClient = useQueryClient();

  const createBonusMutation = () =>
    useMutation({
      mutationFn: async (data: CreateBonusType) => {
        try {
          const response = await api.post("/bonuses", data);
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
        queryClient.invalidateQueries({ queryKey: ["bonuses"] });
        queryClient.invalidateQueries({ queryKey: ["men"] });
        queryClient.invalidateQueries({ queryKey: ["women"] });
      },
    });

  const getAllBonusesQuery = () =>
    useQuery<GetAllBonusesResponse, Error>({
      queryKey: ["bonuses"],
      queryFn: async () => {
        try {
          const response = await api.get(`/bonuses`);

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

  const updateBonusMutation = (id: number | undefined) =>
    useMutation<any, AxiosError, any, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.put(`/bonuses/${id}`, data);
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
        queryClient.invalidateQueries({ queryKey: ["bonuses"] });
      },
    });

  const deleteBonusMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/bonuses/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["bonuses"] });
        queryClient.invalidateQueries({ queryKey: ["men"] });
        queryClient.invalidateQueries({ queryKey: ["women"] });
      },
    });

  return {
    createBonusMutation,
    getAllBonusesQuery,
    deleteBonusMutation,
    updateBonusMutation,
  };
};

export default useBonuses;
