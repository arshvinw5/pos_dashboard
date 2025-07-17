import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.categories.$post({ json });
      return res.json();
    },
    //this will refetch the categories after creating a new one
    onSuccess: () => {
      toast.success("Category created!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });

  return mutation;
};

// useMutation - For handling data mutations (create/update/delete operations)
// useQueryClient - Provides access to the query client for cache management
// InferResponseType/InferRequestType - TypeScript utilities from Hono for type inference
// toast - For showing success/error notifications
