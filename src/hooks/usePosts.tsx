import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { PostType, GetAllPostsResponse, GetSinglePostResponse, DetailType } from "@/types/posts";
import { AxiosError } from "axios";

const usePosts = () => {
  const queryClient = useQueryClient();

  const getAllPostsQuery = () => useQuery<GetAllPostsResponse, Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const response = await api.get(`/posts`);

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

  const getSinglePostQuery = (id: string | undefined) => useQuery<GetSinglePostResponse, Error>({
    queryKey: ["posts", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/posts/${id}`);

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

  const createPostMutation = () => useMutation({
    mutationFn: async (data: PostType) => {
      try {
        const response = await api.post(
          '/posts',
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
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    }
  })

  const updatePostMutation = (id: string | undefined) => useMutation<GetSinglePostResponse, AxiosError, PostType, () => void>({
    mutationFn: async (data) => {
      try {
        const response = await api.patch(
          `/posts/${id}`,
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
      queryClient.invalidateQueries({ queryKey: ["posts", id] })
    }
  })

  const deletePostMutation = (id: number | undefined) => useMutation({
    mutationFn: async () => {
      try {
        const response = await api.delete(`/posts/${id}`);
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
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    }
  })

  const createDetailMutation = (id: string | undefined) => useMutation({
    mutationFn: async (data: DetailType) => {
      try {
        const response = await api.post(
          `/posts/${id}/details`,
          data
        );
        if (response?.data) {
          toast({
            description: "Muvaffaqiyatli yaratildi!"
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
      queryClient.invalidateQueries({ queryKey: ["posts", id] })
    }
  })

  const updateDetailMutation = (id: string | undefined, detailId: string | undefined) => useMutation<GetSinglePostResponse, AxiosError, DetailType, () => void>({
    mutationFn: async (data) => {
      try {
        const response = await api.patch(
          `/posts/${id}/details/${detailId}`,
          data
        );
        if (response?.data) {
          toast({
            description: "Muvaffaqiyatli o'zgartirildi!"
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
      queryClient.invalidateQueries({ queryKey: ["posts", id] })
    }
  })

  return {
    getAllPostsQuery,
    getSinglePostQuery,
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
    createDetailMutation,
    updateDetailMutation
  }
};

export default usePosts
