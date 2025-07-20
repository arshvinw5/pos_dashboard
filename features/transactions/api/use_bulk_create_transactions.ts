import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>;

type RequestType = InferRequestType<
  (typeof client.api.transactions)["bulk-create"]["$post"]
>["json"];

export const useBulkCreateTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const res = await client.api.transactions["bulk-create"]["$post"]({
        json,
      });

      return res.json();
    },

    onSuccess: () => {
      toast.success("Transactions created!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });

      //TODO add invalidation for summary queries if needed
    },
    onError: () => {
      toast.error("Failed to create transactions");
    },
  });

  return mutation;
};
