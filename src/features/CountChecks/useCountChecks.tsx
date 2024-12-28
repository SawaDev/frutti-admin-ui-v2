import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { CreateCountCheckData, GetCountChecksResponse } from "./count-checks.type";


const useCountChecks = () => {
  const queryClient = useQueryClient();

  const createCountCheckMutation = () =>
    useMutation({
      mutationFn: async (data: CreateCountCheckData) => {
        try {
          const response = await api.post("/count-checks", data);
          return response.data;
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["count-checks"] });
      },
    });

  const getCountChecksQuery = () =>
    useQuery<GetCountChecksResponse, Error>({
      queryKey: ["count-checks"],
      queryFn: async () => {
        try {
          const response = await api.get(`/count-checks`);
          
          return structuredClone(response.data);
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
    });

  const deleteCountCheckMutation = () =>
    useMutation({
      mutationFn: async (date: string | null) => {
        try {
          const response = await api.delete(`/count-checks/${date}`);
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli o'chirildi!",
            });
          }
          return response.data;
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error!",
            description: error?.response?.data?.message,
          });
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["count-checks"] });
      },
    });

  return {
    createCountCheckMutation,
    getCountChecksQuery,
    deleteCountCheckMutation,
  };
};

export default useCountChecks;
