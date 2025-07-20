import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.transactions[":id"]["$delete"]({
        param: { id },
      });
      return res.json();
    },
    //this will refetch the transactions after creating a new one
    onSuccess: () => {
      toast.success("Transaction Deleted!");
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      //TODO: invalidate summary
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });

  return mutation;
};

// useMutation - For handling data mutations (create/update/delete operations)
// useQueryClient - Provides access to the query client for cache management
// InferResponseType/InferRequestType - TypeScript utilities from Hono for type inference
// toast - For showing success/error notifications
