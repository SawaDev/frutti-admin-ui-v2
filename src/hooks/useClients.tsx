import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { ClientType, GetAllClientsResponse, GetSingleClientResponse } from "@/types/clients";

const useClients = () => {
  const queryClient = useQueryClient();

  const getAllClientsQuery = () => useQuery<GetAllClientsResponse, Error>({
    queryKey: ["clients"],
    queryFn: async () => {
      try {
        const response = await api.get(`/clients`);

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

  const getSingleClientQuery = (id: string | undefined) => useQuery<GetSingleClientResponse, Error>({
    queryKey: ["clients", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/clients/${id}`);

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

  const createClientMutation = () => useMutation({
    mutationFn: async (data: ClientType) => {
      try {
        const response = await api.post(
          '/clients',
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
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    }
  })

  const updateClientMutation = (id: string | undefined) =>
    useMutation<GetSingleClientResponse, AxiosError, ClientType, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.patch(
            `/clients/${id}`,
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
        queryClient.invalidateQueries({ queryKey: ["clients", id] })
      }
    })

  const deleteClientMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/clients/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["clients"] })
      }
    })

  return {
    getAllClientsQuery,
    getSingleClientQuery,
    createClientMutation,
    updateClientMutation,
    deleteClientMutation
  }
};

export default useClients
