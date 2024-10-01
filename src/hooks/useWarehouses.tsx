import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateWarehouse, GetAllWarehousesResponse, GetSingleWarehouseResponse } from "@/types/warehouses";

const useWarehouses = () => {
  const queryClient = useQueryClient();

  const getAllWarehousesQuery = () => useQuery<GetAllWarehousesResponse, Error>({
    queryKey: ["ingredient-warehouses"],
    queryFn: async () => {
      try {
        const response = await api.get(`/ingredient-warehouses`);

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
    queryKey: ["ingredient-warehouses", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/ingredient-warehouses/${id}`);

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
          '/ingredient-warehouses',
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
      queryClient.invalidateQueries({ queryKey: ["ingredient-warehouses"] })
    }
  })

  const updateWarehouseMutation = (id: string | undefined) => useMutation({
    mutationFn: async (data: CreateWarehouse) => {
      try {
        const response = await api.put(
          `/ingredient-warehouses/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ["ingredient-warehouses", id] })
    }
  })

  const deleteWarehouseMutation = (id: string | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/ingredient-warehouses/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["ingredient-warehouses"] })
      }
    })

  return {
    getAllWarehousesQuery,
    getSingleWarehouseQuery,
    createWarehouseMutation,
    updateWarehouseMutation,
    deleteWarehouseMutation
  }
};

export default useWarehouses
