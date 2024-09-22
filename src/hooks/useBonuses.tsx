import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateBonusType, GetAllBonusesResponse } from "@/types/bonuses";

const useBonuses = () => {
  const queryClient = useQueryClient();

  const createBonusMutation = () => useMutation({
    mutationFn: async (data: CreateBonusType) => {
      try {
        const response = await api.post(
          '/bonuses',
          data
        );
        return response.data;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error?.response?.data?.message,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bonuses"] })
      queryClient.invalidateQueries({ queryKey: ["men"] })
      queryClient.invalidateQueries({ queryKey: ["women"] })
    }
  })

  const getAllBonusesQuery = () => useQuery<GetAllBonusesResponse, Error>({
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
        })
      }
    },
  })

  const deleteBonusMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/bonuses/${id}`);
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli o'chirildi!"
            })
          }
          return response.data;
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          })
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bonuses"] })
        queryClient.invalidateQueries({ queryKey: ["men"] })
        queryClient.invalidateQueries({ queryKey: ["women"] })
      }
    })

  return {
    createBonusMutation,
    getAllBonusesQuery,
    deleteBonusMutation
  }
};

export default useBonuses
