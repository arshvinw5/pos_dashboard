import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
};

const options = ["amount", "payee", "date"];

export const TableHeadSelect = ({
  columnIndex,
  selectedColumns,
  onChange,
}: Props) => {
  const currentSelect = selectedColumns[`column_${columnIndex}`];

  //about code generate-> {
  //   "column_0": "amount",
  //   "column_1": "payee",
  //   "column_2": null,
  //   "column_3": "date"
  // }
  return (
    <Select
      value={currentSelect || ""}
      onValueChange={(value) => onChange(columnIndex, value)}
    >
      <SelectTrigger
        className={cn(
          "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
          currentSelect && "text-blue-900"
        )}
      >
        <SelectValue placeholder="Skip" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="skip">Skip</SelectItem>
        {options.map((option, index) => {
          const disabled =
            Object.values(selectedColumns).includes(option) &&
            selectedColumns[`column_${columnIndex}`] !== option;
          return (
            <SelectItem
              key={index}
              value={option}
              disabled={disabled}
              className="capitalize"
            >
              {option}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
