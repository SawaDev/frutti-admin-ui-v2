import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { ExpenseDataType, GetAllExpenseCategoriesResponse, GetAllExpensesResponse, GetSingleExpenseResponse } from "@/types/expenses";

const useExpenses = () => {
  const queryClient = useQueryClient();

  const getAllExpensesQuery = () => useQuery<GetAllExpensesResponse, Error>({
    queryKey: ["expenses"],
    queryFn: async () => {
      try {
        const response = await api.get(`/expenses`);

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

  const getAllExpenseCategoriesQuery = () => useQuery<GetAllExpenseCategoriesResponse, Error>({
    queryKey: ["expenses", "categories"],
    queryFn: async () => {
      try {
        const response = await api.get(`/expenses/categories`);

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

  const getSingleExpenseQuery = (id: string | undefined) => useQuery<GetSingleExpenseResponse, Error>({
    queryKey: ["expenses", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/expenses/${id}`);

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

  const createExpenseMutation = () => useMutation({
    mutationFn: async (data: ExpenseDataType) => {
      try {
        const response = await api.post(
          '/expenses',
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
      queryClient.invalidateQueries({ queryKey: ["expenses"] })
    }
  })

  const deleteExpenseMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/expenses/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["expenses"] })
      }
    })

  return {
    getAllExpensesQuery,
    getAllExpenseCategoriesQuery,
    getSingleExpenseQuery,
    createExpenseMutation,
    deleteExpenseMutation
  }
};

export default useExpenses
