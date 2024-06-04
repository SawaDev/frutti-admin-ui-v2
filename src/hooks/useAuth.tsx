import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { AuthResponse, AuthType } from "@/types/auth";

const useAuth = () => {

  const authMutation = () =>
    useMutation<AuthResponse, AxiosError, AuthType>({
      mutationFn: async (data) => {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/login`,
            data
          );
          if (response?.data) {
            toast({
              description: "Muvaffaqiyatli yakunlandi!"
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
      }
    })

  return {
    authMutation
  }
};

export default useAuth
