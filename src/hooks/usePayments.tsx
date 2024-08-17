import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { GetAllPaymentsResponse, CreatePaymentType } from "@/types/payments";

const usePayments = () => {
  const queryClient = useQueryClient();

  const createPaymentMutation = () => useMutation({
    mutationFn: async (data: CreatePaymentType) => {
      try {
        const response = await api.post(
          '/payments',
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
      queryClient.invalidateQueries({ queryKey: ["payments"] })
    }
  })

  const getAllPaymentsQuery = () => useQuery<GetAllPaymentsResponse, Error>({
    queryKey: ["payments"],
    queryFn: async () => {
      try {
        const response = await api.get(`/payments`);

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

  const deletePaymentMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/payments/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["payments"] })
      }
    })

  return {
    getAllPaymentsQuery,
    createPaymentMutation,
    deletePaymentMutation
  }
};

export default usePayments
