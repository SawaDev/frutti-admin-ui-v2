import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import {
  CreateMonthlyPaymentType,
  GetMonthlyPaymentsResponse,
} from "./monthlyPayment.type";

const useMonthlyPayments = () => {
  const queryClient = useQueryClient();

  const createMonthlyPaymentMutation = () =>
    useMutation({
      mutationFn: async (data: CreateMonthlyPaymentType) => {
        try {
          const response = await api.post("/monthly-payments", data);
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
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      },
    });

  const getMonthlyPaymentsQuery = ({
    from_date,
    to_date,
  }: {
    from_date: string;
    to_date: string;
  }) =>
    useQuery<GetMonthlyPaymentsResponse, Error>({
      queryKey: ["monthly-payments", from_date, to_date],
      queryFn: async () => {
        try {
          const response = await api.get(`/monthly-payments`, {
            params: {
              from_date,
              to_date,
            },
          });

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

  const deleteMonthlyPaymentMutation = () =>
    useMutation({
      mutationFn: async (date: string | null) => {
        try {
          const response = await api.delete(`/monthly-payments/${date}`);
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
        queryClient.invalidateQueries({ queryKey: ["monthly-payments"] });
      },
    });

  return {
    createMonthlyPaymentMutation,
    getMonthlyPaymentsQuery,
    deleteMonthlyPaymentMutation,
  };
};

export default useMonthlyPayments;
