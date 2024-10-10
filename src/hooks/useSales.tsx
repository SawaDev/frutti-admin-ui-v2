import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import {
  GetAllSalesResponse,
  GetSingleSaleResponse,
  CreateSaleType,
  CreateSaleDataType,
} from "@/types/sales";

const useSales = () => {
  const queryClient = useQueryClient();

  const createSaleMutation = () =>
    useMutation({
      mutationFn: async (data: CreateSaleDataType) => {
        try {
          const response = await api.post("/sales", data);
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli yaratildi!"
            })
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
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.invalidateQueries({ queryKey: ["wallets"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

  const getAllSalesQuery = () =>
    useQuery<GetAllSalesResponse, Error>({
      queryKey: ["sales"],
      queryFn: async () => {
        try {
          const response = await api.get(`/sales`);

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

  const getLastSaleQuery = (id: string | null) =>
    useQuery<GetSingleSaleResponse, Error>({
      queryKey: ["sales", "last", id],
      queryFn: async () => {
        try {
          const response = await api.get(`/sales/last/${id}`);

          return structuredClone(response.data);
        } catch (error: any) {
          console.log(error)
        }
      },
      enabled: !!id,
      retry: 0
    });

  const updateSaleMutation = (id: number) =>
    useMutation({
      mutationFn: async (data: CreateSaleType) => {
        try {
          const response = await api.put(`/sales/${id}`, data);
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
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["sales", id] });
      },
    });

  const deleteSaleMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/sales/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["sales"] });
        queryClient.invalidateQueries({ queryKey: ["clients"] });
        queryClient.invalidateQueries({ queryKey: ["wallets"] });
      },
    });

  return {
    createSaleMutation,
    getAllSalesQuery,
    getLastSaleQuery,
    updateSaleMutation,
    deleteSaleMutation,
  };
};

export default useSales;
