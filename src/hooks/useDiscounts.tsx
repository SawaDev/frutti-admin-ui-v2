import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateDiscountType, GetAllDiscountsResponse } from "@/types/discounts";

const useDiscounts = () => {
  const queryClient = useQueryClient();

  const createDiscountMutation = () => useMutation({
    mutationFn: async (data: CreateDiscountType) => {
      try {
        const response = await api.post(
          '/discounts',
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
      queryClient.invalidateQueries({ queryKey: ["discounts"] })
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    }
  })

  const getAllDiscountsQuery = () => useQuery<GetAllDiscountsResponse, Error>({
    queryKey: ["discounts"],
    queryFn: async () => {
      try {
        const response = await api.get(`/discounts`);

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

  const deleteDiscountMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/discounts/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["discounts"] })
        queryClient.invalidateQueries({ queryKey: ["clients"] })
      }
    })

  return {
    createDiscountMutation,
    getAllDiscountsQuery,
    deleteDiscountMutation
  }
};

export default useDiscounts
