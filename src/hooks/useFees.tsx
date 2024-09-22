import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateFeeType, GetAllFeesResponse } from "@/types/fees";

const useFees = () => {
  const queryClient = useQueryClient();

  const createFeeMutation = () => useMutation({
    mutationFn: async (data: CreateFeeType) => {
      try {
        const response = await api.post(
          '/fees',
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
      queryClient.invalidateQueries({ queryKey: ["fees"] })
      queryClient.invalidateQueries({ queryKey: ["men"] })
      queryClient.invalidateQueries({ queryKey: ["women"] })
    }
  })

  const getAllFeesQuery = () => useQuery<GetAllFeesResponse, Error>({
    queryKey: ["fees"],
    queryFn: async () => {
      try {
        const response = await api.get(`/fees`);

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

  const deleteFeeMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/fees/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["fees"] })
        queryClient.invalidateQueries({ queryKey: ["men"] })
        queryClient.invalidateQueries({ queryKey: ["women"] })
      }
    })

  return {
    createFeeMutation,
    getAllFeesQuery,
    deleteFeeMutation
  }
};

export default useFees
