import CurrencyInput from "react-currency-input-field";
import { Info, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Props = {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
};

export const AmountInput = ({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) => {
  const parseValue = parseFloat(value);
  const isIncome = parseValue > 0;
  const isExpense = parseValue < 0;

  const onReverseValue = () => {
    if (!value) return;
    const newValue = parseFloat(value) * -1;
    onChange(newValue.toString());
  };

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onReverseValue}
              className={cn(
                "bg-slate-900 hover:bg-slate-700 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                isIncome && "bg-green-500 hover:bg-green-600",
                isExpense && "bg-red-500 hover:bg-red-600"
              )}
            >
              {!parseValue && <Info className="size-4 text-white" />}
              {isIncome && (
                <Plus
                  className={cn("size-4 text-white", isIncome && "text-black")}
                />
              )}
              {isExpense && (
                <Minus
                  className={cn("size-4 text-white", isExpense && "text-black")}
                />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            Use [+] for income and [-] for expenses. Click to reverse the
            amount.
          </TooltipContent>
          <CurrencyInput
            prefix="LKR"
            className={cn(
              "pl-11 file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-11 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "pl-11 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "pl-11 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            )}
            placeholder={placeholder}
            value={value}
            decimalsLimit={2}
            decimalScale={2}
            onValueChange={onChange}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {isIncome && "This will count as income"}
            {isExpense && "This will count as expenses"}
          </p>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
