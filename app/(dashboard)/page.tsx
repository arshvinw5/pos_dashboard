"use client";

import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/newAccounts";

export default function Home() {
  const { onOpen } = useNewAccount();
  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className=" font-bold text-white overflow-hidden ">
          This is an authenticated route
        </h1>
        <div>
          <Button onClick={onOpen}>Add Item</Button>
        </div>
      </div>
    </div>
  );
}
