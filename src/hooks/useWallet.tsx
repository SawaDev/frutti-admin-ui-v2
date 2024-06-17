import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { GetAllWalletsResponse, GetSingleWalletResponse, WalletType } from "@/types/wallets";

const useWallets = () => {
  const queryClient = useQueryClient();

  const getAllWalletsQuery = () => useQuery<GetAllWalletsResponse, Error>({
    queryKey: ["wallets"],
    queryFn: async () => {
      try {
        const response = await api.get(`/wallets`);

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

  const getSingleWalletQuery = (id: string | undefined) => useQuery<GetSingleWalletResponse, Error>({
    queryKey: ["wallets", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/wallets/${id}`);

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

  const createWalletMutation = () => useMutation({
    mutationFn: async (data: WalletType) => {
      try {
        const response = await api.post(
          '/wallets',
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
      queryClient.invalidateQueries({ queryKey: ["wallets"] })
    }
  })

  const updateWalletMutation = (id: string | undefined) =>
    useMutation<GetSingleWalletResponse, AxiosError, Omit<WalletType, "balance">, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.patch(
            `/wallets/${id}`,
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
        queryClient.invalidateQueries({ queryKey: ["wallets", id] })
      }
    })

  const deleteWalletMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/wallets/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["wallets"] })
      }
    })

  return {
    getAllWalletsQuery,
    getSingleWalletQuery,
    createWalletMutation,
    updateWalletMutation,
    deleteWalletMutation
  }
};

export default useWallets
