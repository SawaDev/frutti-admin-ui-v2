import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import {
  CreateIngredient,
  CreateIngredientPurchaseType,
  CreateIngredientTransaction,
  GetAllIngredientCategories,
  GetAllIngredientPurchasesTypeResponse,
  GetAllIngredienTransactionsResponse,
  GetAllIngredientsResponse,
  GetSingleIngredientResponse,
  IngredientPurchasesQueryParams,
  UpdateIngredientPurchaseType
} from "@/types/ingredients";
import { ExpenseCategoryType, GetAllExpenseCategoriesResponse } from "@/types/expenses";

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

  const getAllIngredientPurchasesQuery = (data: IngredientPurchasesQueryParams | undefined) => useQuery<GetAllIngredientPurchasesTypeResponse, Error>({
    queryKey: data ? ["purchases", ...Object.values(data)] : ["purchases"],
    queryFn: async () => {
      try {
        const response = await api.post(`/purchases`, data);

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
    mutationFn: async (data: CreateIngredientPurchaseType) => {
      try {
        const response = await api.post(
          '/purchases/new',
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

  const updateIngredientPurchaseMutation = (id: number) => useMutation({
    mutationFn: async (data: UpdateIngredientPurchaseType) => {
      try {
        const response = await api.patch(
          `/purchases/${id}`,
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

  const getAllIngredientCategoriesQuery = () => useQuery<GetAllExpenseCategoriesResponse, Error>({
    queryKey: ["ingredients", "category-options"],
    queryFn: async () => {
      try {
        const response = await api.get(`/ingredients/category-options`);

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

  const createIngredientCategoryMutation = () => useMutation({
    mutationFn: async (data: ExpenseCategoryType) => {
      try {
        const response = await api.post(
          '/ingredients/categories',
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
      queryClient.invalidateQueries({ queryKey: ["ingredients", "category-options"] })
    }
  })

  const getAllIngredientCategoriesExpandedQuery = () => useQuery<GetAllIngredientCategories, Error>({
    queryKey: ["ingredients", "categories"],
    queryFn: async () => {
      try {
        const response = await api.get(`/ingredients/categories`);

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

  return {
    getAllIngredientsQuery,
    getSingleIngredientQuery,
    createIngredientMutation,
    deleteIngredientMutation,
    getAllIngredientPurchasesQuery,
    createIngredientPurchaseMutation,
    updateIngredientPurchaseMutation,
    getAllIngredientTransactionsQuery,
    createIngredientTransactionMutation,
    getAllIngredientCategoriesQuery,
    createIngredientCategoryMutation,
    getAllIngredientCategoriesExpandedQuery
  }
};

export default useIngredients
