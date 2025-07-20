import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<
  typeof client.api.transactions.$post
>["json"];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.transactions.$post({ json });
      return res.json();
    },
    //this will refetch the transactions after creating a new one
    onSuccess: () => {
      toast.success("Transaction created!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      //TODO: invalidate summary
    },

    onError: () => {
      toast.error("Failed to create transaction");
    },
  });

  return mutation;
};

// useMutation - For handling data mutations (create/update/delete operations)
// useQueryClient - Provides access to the query client for cache management
// InferResponseType/InferRequestType - TypeScript utilities from Hono for type inference
// toast - For showing success/error notifications
