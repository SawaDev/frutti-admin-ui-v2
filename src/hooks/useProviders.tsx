import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateProviderType, GetAllProvidersResponse } from "@/types/providers";

const useProviders = () => {
  const queryClient = useQueryClient();

  const createProviderMutation = () => useMutation({
    mutationFn: async (data: CreateProviderType) => {
      try {
        const response = await api.post(
          '/providers',
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
      queryClient.invalidateQueries({ queryKey: ["providers"] })
    }
  })

  const getAllProvidersQuery = () => useQuery<GetAllProvidersResponse, Error>({
    queryKey: ["providers"],
    queryFn: async () => {
      try {
        const response = await api.get(`/providers`);

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

  const deleteProviderMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/providers/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["providers"] })
      }
    })

  return {
    createProviderMutation,
    getAllProvidersQuery,
    deleteProviderMutation
  }
};

export default useProviders
