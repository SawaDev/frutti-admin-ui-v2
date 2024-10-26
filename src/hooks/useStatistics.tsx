import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { GetStatisticsResponse } from "@/types/statistics";

const useStatistics = () => {
  const getStatisticsQuery = () =>
    useQuery<GetStatisticsResponse, Error>({
      queryKey: ["statistics"],
      queryFn: async () => {
        try {
          const response = await api.get(`/statistics`);

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

  return {
    getStatisticsQuery,
  };
};

export default useStatistics;
