import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateWarehouse, GetAllWarehousesResponse, GetSingleWarehouseResponse } from "@/types/warehouses";

const useWarehouses = () => {
  const queryClient = useQueryClient();

  const getAllWarehousesQuery = () => useQuery<GetAllWarehousesResponse, Error>({
    queryKey: ["warehouses"],
    queryFn: async () => {
      try {
        const response = await api.get(`/warehouses`);

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

  const getSingleWarehouseQuery = (id: string | undefined) => useQuery<GetSingleWarehouseResponse, Error>({
    queryKey: ["warehouses", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/warehouses/${id}`);

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

  const createWarehouseMutation = () => useMutation({
    mutationFn: async (data: CreateWarehouse) => {
      try {
        const response = await api.post(
          '/warehouses',
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
      queryClient.invalidateQueries({ queryKey: ["warehouses"] })
    }
  })

  const deleteWarehouseMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/warehouses/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["warehouses"] })
      }
    })

  return {
    getAllWarehousesQuery,
    getSingleWarehouseQuery,
    createWarehouseMutation,
    deleteWarehouseMutation
  }
};

export default useWarehouses
