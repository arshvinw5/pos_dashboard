"use client";
import { useState } from "react";
import { useGetTransactions } from "@/features/transactions/api/use_get_transactions";
import { useBulkDeleteTransaction } from "@/features/transactions/api/use_bulk_delete_transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewTransaction } from "@/features/transactions/hooks/use_new_transaction";

import { UploadButton } from "./upload_button";
import { ImportCard } from "./import_card";

enum VARIANTS {
  LIST = "list",
  IMPORT = "import",
}

const INITIAL_IMPORT_RESULT = {
  data: [],
  error: [],
  meta: [],
};

const TransactionPage = () => {
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResult, setImportResult] = useState<
    typeof INITIAL_IMPORT_RESULT
  >(INITIAL_IMPORT_RESULT);

  const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
    setVariant(VARIANTS.IMPORT);
    setImportResult(results);
    console.log("Upload results:", results);
  };

  const cancelImport = () => {
    setImportResult(INITIAL_IMPORT_RESULT);
    setVariant(VARIANTS.LIST);
  };
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
  //once you get the value from onUpload, you can set the variant to IMPORT
  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <ImportCard
          data={importResult.data}
          onCancel={cancelImport}
          onSubmit={() => {}}
        />
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl max-auto w-full pb-10 -mt-24 ">
      <Card className="border-none drop-shadow-sm bg-white/85">
        <CardHeader className="gap-y-2 md:flex md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <div className="flex flex-col md:flex-row md:space-x-2 space-x-0 gap-y-2 md:gap-y-0 items-center">
            <Button onClick={onOpen} size="sm" className="w-full md:w-auto">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
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
