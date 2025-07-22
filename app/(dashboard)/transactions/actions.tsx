"use client";

import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOpenAccount } from "@/features/accounts/hooks/use_open_accounts";
import { useDeleteAccount } from "@/features/accounts/api/use.delete.account";
import { useConfirm } from "@/hooks/use_confirm";

type Props = {
  id?: string;
};
export const Actions = ({ id }: Props) => {
  const deleteMutation = useDeleteAccount(id);
  const { onOpen } = useOpenAccount();

  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete the selected rows?"
  );

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
            onClick={() =>
              id !== undefined && id !== null ? onOpen(id) : null
            }
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            className="cursor-pointer"
            onClick={onDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
