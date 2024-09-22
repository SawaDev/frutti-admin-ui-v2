import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateWorkDayData, GetAllWorkResponse } from "@/types/work-days";

const useWorkDays = () => {
  const queryClient = useQueryClient();

  const createWorkDayMutation = () => useMutation({
    mutationFn: async (data: CreateWorkDayData) => {
      try {
        const response = await api.post(
          '/work-days',
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
      queryClient.invalidateQueries({ queryKey: ["work-days"] });
      queryClient.invalidateQueries({ queryKey: ["men"] });
    }
  })

  const getAllWorkDaysQuery = () => useQuery<GetAllWorkResponse, Error>({
    queryKey: ["work-days"],
    queryFn: async () => {
      try {
        const response = await api.get(`/work-days`);

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

  const deleteWorkDayMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/work-days/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["work-days"] })
      }
    })

  return {
    createWorkDayMutation,
    getAllWorkDaysQuery,
    deleteWorkDayMutation
  }
};

export default useWorkDays
