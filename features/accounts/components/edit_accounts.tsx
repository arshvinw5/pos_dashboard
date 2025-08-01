import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AccountForm } from "./account_form";
import { insertAccountSchema } from "@/db/schema";
import { useGetAccountById } from "../api/use_get_account_by_id";
import { Loader2 } from "lucide-react";
import { useOpenAccount } from "../hooks/use_open_accounts";
import { useEditAccount } from "../api/use_edit_account";
import { useDeleteAccount } from "../api/use.delete.account";
import { useConfirm } from "@/hooks/use_confirm";

export const EditAccountSheet = ({}) => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccountById(id);

  const editMutation = useEditAccount(id);

  const deleteMutation = useDeleteAccount(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = accountQuery.isLoading;

  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete the selected rows?"
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchema = insertAccountSchema.pick({
    name: true,
  });

  const defaultValues = accountQuery.data
    ? {
        name: accountQuery.data.name,
      }
    : { name: "" };

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
        console.error("Error creating account:", error);
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
            <SheetTitle>Edit Account</SheetTitle>
            <SheetDescription>
              Edit the details of your account here. Make sure to save your
              changes.
            </SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disable={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
