"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertCategoriesSchema } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

const formSchema = insertCategoriesSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  onDelete?: () => void;
  disable?: boolean;
};

export const CategoryForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disable,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-10 pt-4 px-4 "
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disable}
                  {...field}
                  placeholder="Ex : Food , Travel , Utilities etc."
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={disable} type="submit">
          {id ? "Save Changes" : "Create a category"}
        </Button>
        {!!id && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={disable}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2 " />
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
};
