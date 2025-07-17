import { z } from "zod";
import { useCreateCategory } from "../api/use_create_category";
import { insertCategoriesSchema } from "@/db/schema";
import { CategoryForm } from "./category_form";
import { useNewCategory } from "../hooks/newCategory";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const CategorySheet = ({}) => {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchema = insertCategoriesSchema.pick({
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
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disable={mutation.isPending}
          defaultValues={{ name: "" }}
        />
        {/* Add form or content for managing categories here */}
      </SheetContent>
    </Sheet>
  );
};
