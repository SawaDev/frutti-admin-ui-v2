import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { CreateWomanType, GetAllWomenResponse, GetSingleWomanResponse, UpdateWomanType } from "@/types/woman";
import { z } from "zod";
import { womanProductsSchema } from "@/schema/woman";

const useWomen = () => {
  const queryClient = useQueryClient();

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

  const createWomanProductsMutation = () => useMutation({
    mutationFn: async (data: z.infer<typeof womanProductsSchema>) => {
      try {
        const response = await api.post(
          '/women/products',
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
      queryClient.invalidateQueries({ queryKey: ["women"] });
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })

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
    createWomanMutation,
    createWomanProductsMutation,
    getAllWomenQuery,
    getSingleWomanQuery,
    updateWomanMutation,
    deleteWomanMutation
  }
};

export default useWomen
