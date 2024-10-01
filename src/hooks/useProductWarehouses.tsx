import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateProductWarehouse, GetAllProductWarehousesResponse, GetSingleProductWarehouseResponse } from "@/types/product-warehouses";

const useProductWarehouses = () => {
  const queryClient = useQueryClient();

  const createProductWarehouseMutation = () => useMutation({
    mutationFn: async (data: CreateProductWarehouse) => {
      try {
        const response = await api.post(
          '/product-warehouses',
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
      queryClient.invalidateQueries({ queryKey: ["product-warehouses"] })
    }
  })

  const getAllProductWarehousesQuery = () => useQuery<GetAllProductWarehousesResponse, Error>({
    queryKey: ["product-warehouses"],
    queryFn: async () => {
      try {
        const response = await api.get(`/product-warehouses`);

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

  const getSingleProductWarehouseQuery = (id: string | undefined) => useQuery<GetSingleProductWarehouseResponse, Error>({
    queryKey: ["product-warehouses", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/product-warehouses/${id}`);

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

  const deleteProductWarehouseMutation = (id: string | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/product-warehouses/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["product-warehouses"] })
      }
    })

  const updateProductWarehouseMutation = (id: string | undefined) =>
    useMutation<GetSingleProductWarehouseResponse, Error, CreateProductWarehouse, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.patch(
            `/product-warehouses/${id}`,
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
        queryClient.invalidateQueries({ queryKey: ["product-warehouses", id] })
      }
    })

  return {
    createProductWarehouseMutation,
    getAllProductWarehousesQuery,
    getSingleProductWarehouseQuery,
    updateProductWarehouseMutation,
    deleteProductWarehouseMutation
  }
};

export default useProductWarehouses
