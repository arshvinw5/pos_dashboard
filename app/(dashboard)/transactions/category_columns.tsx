import { useOpenCategory } from "@/features/categories/hooks/use_open_category";
import { useOpenTransactions } from "@/features/transactions/hooks/use_open_transaction";
import { TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
};

export const CategoryColumn = ({ id, category, categoryId }: Props) => {
  //just add alias for onOpen
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransactions();

  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId);
    } else {
      onOpenTransaction(id);
    }
  };
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !category && "text-red-500"
      )}
      onClick={onClick}
    >
      {!category && <TriangleAlert className="size-4 mr-2 shrink-0" />}
      {category || "Uncategorized"}
    </div>
  );
};
