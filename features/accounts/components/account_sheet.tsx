import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useNewAccount } from "../hooks/newAccounts";

export const AccountSheet = ({}) => {
  const { isOpen, onClose } = useNewAccount();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="spcece-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to manage your finances.
          </SheetDescription>
        </SheetHeader>
        {/* Add form or content for managing accounts here */}
      </SheetContent>
    </Sheet>
  );
};
