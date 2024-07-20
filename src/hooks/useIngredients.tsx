import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateIngredient, CreateIngredientTransaction, GetAllIngredientPurchasesTypeResponse, GetAllIngredienTransactionsResponse, GetAllIngredientsResponse, GetSingleIngredientResponse, IngredientPurchaseType } from "@/types/ingredients";

const useIngredients = () => {
  const queryClient = useQueryClient();

  const getAllIngredientsQuery = () => useQuery<GetAllIngredientsResponse, Error>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      try {
        const response = await api.get(`/ingredients`);

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

  const getSingleIngredientQuery = (id: string | undefined) => useQuery<GetSingleIngredientResponse, Error>({
    queryKey: ["ingredients", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/ingredients/${id}`);

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

  const createIngredientMutation = () => useMutation({
    mutationFn: async (data: CreateIngredient) => {
      try {
        const response = await api.post(
          '/ingredients',
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
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
    }
  })

  const deleteIngredientMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/ingredients/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      }
    })

  const getAllIngredientPurchasesQuery = () => useQuery<GetAllIngredientPurchasesTypeResponse, Error>({
    queryKey: ["purchases"],
    queryFn: async () => {
      try {
        const response = await api.get(`/purchases`);

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

  const createIngredientPurchaseMutation = () => useMutation({
    mutationFn: async (data: IngredientPurchaseType) => {
      try {
        const response = await api.post(
          '/purchases',
          data
        );

        toast({
          title: "Muvaffaqiyatli saqlandi!"
        })
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
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      queryClient.invalidateQueries({ queryKey: ["purchases"] })
    }
  })

  const getAllIngredientTransactionsQuery = () => useQuery<GetAllIngredienTransactionsResponse, Error>({
    queryKey: ["ingredient-transactions"],
    queryFn: async () => {
      try {
        const response = await api.get(`/ingredient-transactions`);

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

  const createIngredientTransactionMutation = () => useMutation({
    mutationFn: async (data: CreateIngredientTransaction) => {
      try {
        const response = await api.post(
          '/ingredient-transactions',
          data
        );

        toast({
          title: "Muvaffaqiyatli saqlandi!"
        })

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
      queryClient.invalidateQueries({ queryKey: ["ingredients"] })
      queryClient.invalidateQueries({ queryKey: ["ingredient-transactions"] })
    }
  })

  return {
    getAllIngredientsQuery,
    getSingleIngredientQuery,
    createIngredientMutation,
    deleteIngredientMutation,
    getAllIngredientPurchasesQuery,
    createIngredientPurchaseMutation,
    getAllIngredientTransactionsQuery,
    createIngredientTransactionMutation
  }
};

export default useIngredients
