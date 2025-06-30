import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const res = await client.api.accounts.$get();

      //we have to separately take care the error here
      if (!res.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await res.json();

      return data;
    },
  });
  return query;
};

//this hook has been made for fetch the data user acc data form the server with tank

//client - This is your Hono API client for making HTTP requests
// useQuery - The main hook from TanStack Query for fetching data
// queryKey - A unique key for the query, used for caching and refetching
