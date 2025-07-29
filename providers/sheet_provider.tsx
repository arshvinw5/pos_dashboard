"use client";

import { AccountSheet } from "@/features/accounts/components/account_sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit_accounts";
import { CategorySheet } from "@/features/categories/components/category_sheet";
import { EditCategorySheet } from "@/features/categories/components/edit_category_sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit_transactions";
import { TransactionSheet } from "@/features/transactions/components/transaction_sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
  //This hook returns a function
  // that tells you whether the React component is currently mounted in the DOM.
  const isMounted = useMountedState();

  if (!isMounted()) return null;

  return (
    <div>
      <AccountSheet />
      <EditAccountSheet />
      <CategorySheet />
      <EditCategorySheet />
      <TransactionSheet />
      <EditTransactionSheet />
    </div>
  );
};

//hydration mismatches and memory leaks
