import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateProductType, GetAllProductsResponse, GetSingleProductResponse } from "@/types/products";

const useProducts = () => {
  const queryClient = useQueryClient();

  const createProductMutation = () => useMutation({
    mutationFn: async (data: CreateProductType) => {
      try {
        const response = await api.post(
          '/products',
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
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })

  const getAllProductsQuery = () => useQuery<GetAllProductsResponse, Error>({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await api.get(`/products`);

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

  const getSingleProductQuery = (id: string | undefined) => useQuery<GetSingleProductResponse, Error>({
    queryKey: ["products", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/products/${id}`);

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

  const updateProductMutation = (id: string | undefined) => useMutation({
    mutationFn: async (data: Partial<CreateProductType>) => {
      try {
        const response = await api.post(
          `/products/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ["products"] })
    }
  })

  const deleteProductMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/products/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["products"] })
      }
    })

  return {
    createProductMutation,
    getAllProductsQuery,
    getSingleProductQuery,
    updateProductMutation,
    deleteProductMutation
  }
};

export default useProducts
