import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await client.api.categories.$get();

      //we have to separately take care the error here
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
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
