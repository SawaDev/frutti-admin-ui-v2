import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { GetAllUsersResponse, UserType } from "@/types/users";
import { GetSinglePostResponse } from "@/types/posts";

const useUsers = () => {
  const queryClient = useQueryClient();

  const getAllUsersQuery = () => useQuery<GetAllUsersResponse, Error>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const response = await api.get(`/users`);

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

  const getSingleUserQuery = (id: string | undefined) => useQuery<GetSinglePostResponse, Error>({
    queryKey: ["users", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/users/${id}`);

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

  const createUserMutation = () => useMutation({
    mutationFn: async (data: Omit<UserType, 'password_again'>) => {
      try {
        const response = await api.post(
          '/users',
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
      queryClient.invalidateQueries({ queryKey: ["users"] })
    }
  })

  const updateUserMutation = (id: string | undefined) =>
    useMutation<GetSinglePostResponse, AxiosError, UserType, () => void>({
      mutationFn: async (data) => {
        try {
          const response = await api.patch(
            `/users/${id}`,
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
        queryClient.invalidateQueries({ queryKey: ["users", id] })
      }
    })

  const deleteUserMutation = (id: number | undefined) =>
    useMutation({
      mutationFn: async () => {
        try {
          const response = await api.delete(`/users/${id}`);
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
        queryClient.invalidateQueries({ queryKey: ["users"] })
      }
    })

  return {
    getAllUsersQuery,
    getSingleUserQuery,
    createUserMutation,
    updateUserMutation,
    deleteUserMutation
  }
};

export default useUsers
