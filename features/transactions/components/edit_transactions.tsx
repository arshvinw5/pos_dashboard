import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { TransactionForm } from "./transaction_form";
import { insertTransactionSchema } from "@/db/schema";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use_confirm";

import { useOpenTransactions } from "../hooks/use_open_transaction";
import { useEditTransactions } from "../api/use_edit_transactions";
import { useDeleteTransaction } from "../api/use.delete.transaction";
import { useGetTransactionById } from "../api/use_get_transaction_by_id";

import { useGetCategories } from "@/features/categories/api/use_get_categories";
import { useCreateCategory } from "@/features/categories/api/use_create_category";
import { useGetAccounts } from "@/features/accounts/api/use_get_accounts";
import { useCreateAccount } from "@/features/accounts/api/use_create_account";

export const EditTransactionSheet = ({}) => {
  const { isOpen, onClose, id } = useOpenTransactions();

  const transactionQuery = useGetTransactionById(id);

  const editMutation = useEditTransactions(id);

  const deleteMutation = useDeleteTransaction(id);

  //category query and mutation
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });

  //The map function transforms each category object in the array into a new object structure.

  const categoryOption = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  //account query and mutation
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });

  const accountOption = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete the selected rows?"
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchema = insertTransactionSchema.omit({
    id: true,
  });

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  type FormValues = z.input<typeof formSchema>;

  const onSubmit = (vales: FormValues) => {
    console.log({ vales });
    // Handle form submission logic here

    editMutation.mutate(vales, {
      onSuccess: () => {
        //to close the drawer after editing
        onClose();
      },
      onError: (error) => {
        console.error("Error creating transaction:", error);
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          //to close the drawer after deletion
          onClose();
        },
      });
    }
  };
  return (
    <div>
      <ConfirmationDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>
              Edit the details of your transaction here. Make sure to save your
              changes.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              onDelete={onDelete}
              disabled={isPending}
              categoryOptions={categoryOption}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOption}
              onCreateAccount={onCreateAccount}
              defaultValues={defaultValues}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
