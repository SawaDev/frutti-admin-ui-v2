import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { CurrencyType, GetAllCurrenciesResponse, GetSingleCurrencyResponse } from "@/types/currencies";
import { useCurrencyStore } from "@/store/currency";

const useCurrencies = () => {
  const queryClient = useQueryClient();
  const { currencies } = useCurrencyStore()

  const getAllCurrenciesQuery = () => useQuery<GetAllCurrenciesResponse, Error>({
    queryKey: ["currencies"],
    queryFn: async () => {
      try {
        const response = await api.get(`/currencies`);

        return structuredClone(response.data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error!",
          description: error?.response?.data?.message,
        })
        return null;
      }
    },
    retry: 1,
    enabled: currencies?.length ? false : true,
  })

  const getSingleCurrencyQuery = (id: string | undefined) => useQuery<GetSingleCurrencyResponse, Error>({
    queryKey: ["currencies", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/currencies/${id}`);

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

  const createCurrencyMutation = () => useMutation({
    mutationFn: async (data: CurrencyType) => {
      try {
        const response = await api.post(
          '/currencies',
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
      queryClient.invalidateQueries({ queryKey: ["currencies"] })
    }
  })

  const updateCurrencyMutation = (id: number | undefined) =>
    useMutation<GetSingleCurrencyResponse, AxiosError, { distribution: number }, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.patch(
            `/currencies/${id}`,
            data
          );
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli saqlandi!"
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
        queryClient.invalidateQueries({ queryKey: ["currencies", id] })
      }
    })

  const deleteCurrencyMutation = (id: string | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/currencies/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["currencies"] })
      }
    })

  return {
    getAllCurrenciesQuery,
    getSingleCurrencyQuery,
    createCurrencyMutation,
    updateCurrencyMutation,
    deleteCurrencyMutation
  }
};

export default useCurrencies
