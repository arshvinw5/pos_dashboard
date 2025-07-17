import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CategoryForm } from "./category_form";
import { insertCategoriesSchema } from "@/db/schema";
import { useGetCategoryById } from "../api/use_get_category_by_id";
import { Loader2 } from "lucide-react";
import { useOpenCategory } from "../hooks/use_open_category";
import { useDeleteCategory } from "../api/use_delete_category";
import { useConfirm } from "@/hooks/use_confirm";
import { useEditCategory } from "../api/use_edit_category";

export const EditCategorySheet = ({}) => {
  const { isOpen, onClose, id } = useOpenCategory();

  const categoryQuery = useGetCategoryById(id);

  const editMutation = useEditCategory(id);

  const deleteMutation = useDeleteCategory(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = categoryQuery.isLoading;

  const [ConfirmationDialog, confirm] = useConfirm(
    "Confirm Deletion",
    "Are you sure you want to delete the selected rows?"
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const formSchema = insertCategoriesSchema.pick({
    name: true,
  });

  const defaultValues = categoryQuery.data
    ? {
        name: categoryQuery.data.name,
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
            <CategoryForm
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
