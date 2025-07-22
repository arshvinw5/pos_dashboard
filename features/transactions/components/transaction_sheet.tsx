import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewTransaction } from "../hooks/use_new_transaction";
import { insertTransactionSchema } from "@/db/schema";
import { useCreateTransaction } from "../api/use_create_transaction";
import { TransactionForm } from "./transaction_form";

import { useCreateCategory } from "@/features/categories/api/use_create_category";
import { useGetCategories } from "@/features/categories/api/use_get_categories";

import { useGetAccounts } from "@/features/accounts/api/use_get_accounts";
import { useCreateAccount } from "@/features/accounts/api/use_create_account";

export const TransactionSheet = ({}) => {
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchema = insertTransactionSchema.omit({
    id: true,
  });

  type FormValues = z.input<typeof formSchema>;

  const onSubmit = (vales: FormValues) => {
    console.log({ vales });
    // Handle form submission logic here

    createMutation.mutate(vales, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Error creating account:", error);
      },
    });
  };

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Add a new transaction to your account.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin size-8 text-[#31363F]" />
          </div>
        ) : (
          <div>
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOption}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOption}
              onCreateAccount={onCreateAccount}
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// This format is commonly used by form
//  libraries and select components where:

// label is what the user sees in the dropdown
// value is what gets submitted when the option is selected
// This pattern is repeated in your code for both categories
// and accounts, creating consistent option arrays for form selects.
