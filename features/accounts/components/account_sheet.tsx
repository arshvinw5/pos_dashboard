import { z } from "zod";
import { useCreateAccount } from "../api/use_create_account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccount } from "../hooks/newAccounts";
import { AccountForm } from "./account_form";
import { insertAccountSchema } from "@/db/schema";

export const AccountSheet = ({}) => {
  const { isOpen, onClose } = useNewAccount();

  const mutation = useCreateAccount();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchema = insertAccountSchema.pick({
    name: true,
  });

  type FormValues = z.input<typeof formSchema>;

  const onSubmit = (vales: FormValues) => {
    console.log({ vales });
    // Handle form submission logic here

    mutation.mutate(vales, {
      onSuccess: () => {
        onClose();
      },
      onError: (error) => {
        console.error("Error creating account:", error);
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to manage your finances.
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          disable={mutation.isPending}
          defaultValues={{ name: "" }}
        />
        {/* Add form or content for managing accounts here */}
      </SheetContent>
    </Sheet>
  );
};
