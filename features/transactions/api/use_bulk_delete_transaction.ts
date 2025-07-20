import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

//always check the variable then you find

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.transactions["bulk-delete"]["$post"]({
        json,
      });
      return res.json();
    },
    //this will refetch the transactions after creating a new one
    onSuccess: () => {
      toast.success("Transactions deleted!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      //TODO: Also invalidate summary queries if needed
    },
    onError: () => {
      toast.error("Failed to delete transactions");
    },
  });

  return mutation;
};

// useMutation - For handling data mutations (create/update/delete operations)
// useQueryClient - Provides access to the query client for cache management
// InferResponseType/InferRequestType - TypeScript utilities from Hono for type inference
// toast - For showing success/error notifications
