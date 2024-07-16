import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateExchangeType, GetAllExchangesResponse, GetSingleExchangeResponse } from "@/types/wallets";

const useExchanges = () => {
  const queryClient = useQueryClient();

  const getAllExchangesQuery = () => useQuery<GetAllExchangesResponse, Error>({
    queryKey: ["exchanges"],
    queryFn: async () => {
      try {
        const response = await api.get(`/exchanges`);

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

  const getSingleExchangeQuery = (id: string | undefined) => useQuery<GetSingleExchangeResponse, Error>({
    queryKey: ["exchanges", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/exchanges/${id}`);

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

  const getExchangesByWalletIdQuery = (walletId: string | undefined) => useQuery<GetAllExchangesResponse, Error>({
    queryKey: ["exchanges", "byWallet", walletId],
    queryFn: async () => {
      try {
        const response = await api.get(`/exchanges/byWallet/${walletId}`);

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

  const createExchangeMutation = () => useMutation({
    mutationFn: async (data: CreateExchangeType) => {
      try {
        const response = await api.post(
          '/exchanges',
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
      queryClient.invalidateQueries({ queryKey: ["exchanges"] })
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
    }
  })

  const deleteExchangeMutation = (id: string | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/exchanges/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["exchanges"] })
      }
    })

  return {
    getAllExchangesQuery,
    getSingleExchangeQuery,
    getExchangesByWalletIdQuery,
    createExchangeMutation,
    deleteExchangeMutation
  }
};

export default useExchanges
