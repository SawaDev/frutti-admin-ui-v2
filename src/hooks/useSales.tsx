import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import {
  GetAllSalesResponse,
  GetSingleSaleResponse,
  CreateSaleDataType,
  GetSalesParamsType,
} from "@/types/sales";
import { convertToQueryString } from "@/lib/utils";

const useSales = () => {
  const queryClient = useQueryClient();

  const createSaleMutation = () =>
    useMutation({
      mutationFn: async (data: CreateSaleDataType) => {
        try {
          const response = await api.post("/sales", data);
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli yaratildi!",
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
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

  const getAllSalesQuery = (params?: GetSalesParamsType) =>
    useQuery<GetAllSalesResponse, Error>({
      queryKey: ["sales", params?.from_date, params?.to_date, params?.is_free],
      queryFn: async () => {
        try {
          const response = await api.get(
            `/sales${params ? convertToQueryString(params) : ""}`,
          );

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
          console.log(error);
        }
      },
      enabled: !!id,
      retry: 0,
    });

  const getSaleById = (id: string | null) =>
    useQuery<GetSingleSaleResponse, Error>({
      queryKey: ["sales", id],
      queryFn: async () => {
        try {
          if (!id) return;
          const response = await api.get(`/sales/${id}`);

          return structuredClone(response.data);
        } catch (error: any) {
          console.log(error);
        }
      },
      enabled: !!id,
      retry: 0,
    });

  const updateSaleMutation = (id?: number) =>
    useMutation({
      mutationFn: async (data: CreateSaleDataType) => {
        try {
          console.log(id, data);
          if (!id) return;
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
        queryClient.invalidateQueries({ queryKey: ["sales", id?.toString()] });
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
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });

  return {
    createSaleMutation,
    getAllSalesQuery,
    getLastSaleQuery,
    getSaleById,
    updateSaleMutation,
    deleteSaleMutation,
  };
};

export default useSales;
