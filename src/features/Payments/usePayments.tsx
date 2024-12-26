import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import {
  CreatePaymentType,
  GetAllPaymentsParams,
  GetAllPaymentsResponse,
} from "./payments.type";
import { AxiosError } from "axios";

const usePayments = () => {
  const queryClient = useQueryClient();

  const createPaymentMutation = () =>
    useMutation({
      mutationFn: async (data: CreatePaymentType) => {
        try {
          const response = await api.post("/payments", data);
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

  const updatePaymentMutation = (id: number | undefined) =>
    useMutation<any, AxiosError, any, () => void>({
      mutationFn: async (data) => {
        const response = await api.put(`/payments/${id}`, data);
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
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      },
    });

  const getAllPaymentsQuery = (params: GetAllPaymentsParams) =>
    useQuery<GetAllPaymentsResponse, Error>({
      queryKey: [
        "payments",
        params.from_date,
        params.to_date,
        params.gender,
        params.salary_type,
      ],
      queryFn: async () => {
        try {
          const response = await api.get(`/payments`, { params });

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

  const deletePaymentMutation = (id: number | null) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/payments/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["payments"] });
      },
    });

  return {
    getAllPaymentsQuery,
    createPaymentMutation,
    deletePaymentMutation,
    updatePaymentMutation,
  };
};

export default usePayments;
