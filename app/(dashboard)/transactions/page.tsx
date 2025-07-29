"use client";
import { useGetTransactions } from "@/features/transactions/api/use_get_transactions";
import { useBulkDeleteTransaction } from "@/features/transactions/api/use_bulk_delete_transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hooks/use_new_transaction";

const TransactionPage = () => {
  const { onOpen } = useNewTransaction();
  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useBulkDeleteTransaction();

  const transactions = transactionsQuery.data || [];
  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
    return (
      <div className="max-w-screen-2xl max-auto w-full pb-10 -mt-24 ">
        <Card className="border-none drop-shadow-sm bg-white/85">
          <CardHeader className="gap-y-2 md:flex md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-28" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="size-8  text-[#31363F] animate-spin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl max-auto w-full pb-10 -mt-24 ">
      <Card className="border-none drop-shadow-sm bg-white/85">
        <CardHeader className="gap-y-2 md:flex md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <Button onClick={onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            filterKey="payee"
            columns={columns}
            data={transactions}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPage;
