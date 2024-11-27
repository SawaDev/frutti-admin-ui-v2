import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { GetAllTransactionsResponse, GetSingleTransactionResponse, TransactionDataType } from "@/types/transactions";

const useTransactions = () => {
  const queryClient = useQueryClient();

  const getAllTransactionsQuery = () => useQuery<GetAllTransactionsResponse, Error>({
    queryKey: ["transactions"],
    queryFn: async () => {
      try {
        const response = await api.get(`/transactions`);

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

  const getSingleTransactionQuery = (id: string | undefined) => useQuery<GetSingleTransactionResponse, Error>({
    queryKey: ["transactions", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/transactions/${id}`);

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

  const createTransactionMutation = () => useMutation({
    mutationFn: async (data: TransactionDataType) => {
      try {
        const response = await api.post(
          '/transactions',
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
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    }
  })

  const updateTransactionMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async (data: Partial<TransactionDataType>) => {
        try {
          if (!id) return;
          const response = await api.patch(`/transactions/${id}`, data);
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
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
      },
    });

  const deleteTransactionMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/transactions/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
      }
    })

  return {
    getAllTransactionsQuery,
    getSingleTransactionQuery,
    createTransactionMutation,
    updateTransactionMutation,
    deleteTransactionMutation
  }
};

export default useTransactions
