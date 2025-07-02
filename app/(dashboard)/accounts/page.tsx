"use client";
import { useNewAccount } from "@/features/accounts/hooks/newAccounts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { columns, Payment } from "./columns";
import { DataTable } from "@/components/data-table";

const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52f",
    amount: 100,
    status: "success",
    email: "tarshvin@example.com",
  },
];

const AccountsPage = () => {
  const newAccount = useNewAccount();

  return (
    <div className="max-w-screen-2xl max-auto w-full pb-10 -mt-24 ">
      <Card className="border-none drop-shadow-sm bg-white/80">
        <CardHeader className="gap-y-2 md:flex md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl line-clamp-1">Accounts</CardTitle>
          <Button onClick={newAccount.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add new
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            onDelete={() => {}}
            filterKey="email"
            columns={columns}
            data={data}
            disabled={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountsPage;
