"use client";

import { AccountSheet } from "@/features/accounts/components/account_sheet";
import { useMountedState } from "react-use";

export const SheetProvider = () => {
  //This hook returns a function
  // that tells you whether the React component is currently mounted in the DOM.
  const isMounted = useMountedState();

  if (!isMounted()) return null;

  return (
    <div>
      <AccountSheet />
    </div>
  );
};

//hydration mismatches and memory leaks
