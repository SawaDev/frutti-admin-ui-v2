import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { CreateWomanType, GetAllWomenResponse, GetSingleWomanResponse, UpdateWomanType } from "@/types/woman";

const useWomen = () => {
  const queryClient = useQueryClient();

  const getAllWomenQuery = () => useQuery<GetAllWomenResponse, Error>({
    queryKey: ["women"],
    queryFn: async () => {
      try {
        const response = await api.get(`/women`);

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

  const getSingleWomanQuery = (id: string | undefined) => useQuery<GetSingleWomanResponse, Error>({
    queryKey: ["women", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/women/${id}`);

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

  const createWomanMutation = () => useMutation({
    mutationFn: async (data: CreateWomanType) => {
      try {
        const response = await api.post(
          '/women',
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
      queryClient.invalidateQueries({ queryKey: ["women"] })
    }
  })

  const updateWomanMutation = (id: string | undefined) =>
    useMutation<GetSingleWomanResponse, AxiosError, UpdateWomanType, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.patch(
            `/women/${id}`,
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
        queryClient.invalidateQueries({ queryKey: ["women", id] })
        queryClient.invalidateQueries({ queryKey: ["women"] })
      }
    })

  const deleteWomanMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/women/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["women"] })
      }
    })

  return {
    getAllWomenQuery,
    getSingleWomanQuery,
    createWomanMutation,
    updateWomanMutation,
    deleteWomanMutation
  }
};

export default useWomen
