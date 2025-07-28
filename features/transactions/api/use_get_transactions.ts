import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { milliunitsToAmount } from "@/lib/utils";

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId }],
    queryFn: async () => {
      const res = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        },
      });

      //we have to separately take care the error here
      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const { data } = await res.json();

      return data.map((transactions) => ({
        ...transactions,
        // Convert mille units to amount for display otherwise we will getting some weird values
        amount: milliunitsToAmount(transactions.amount),
      }));
    },
  });
  return query;
};

// Cache Key: Unique identifier based on filter parameters
// Automatic Refetching: When URL parameters change, the query key changes, triggering a new API call
// Background Updates: TanStack Query handles stale data updates automatically
