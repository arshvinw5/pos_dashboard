import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImportTable } from "./import_table";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "MMM dd, yyyy";

const requiredOptions = ["a</Button>mount", "date", "payee"];

interface selectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: string[][]) => void;
};
export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<selectedColumnsState>(
    {}
  );
  const headers = data[0];
  const body = data.slice(1);

  const onTableHeaderSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((previousValue) => {
      const newSelectedColumns = { ...previousValue };
      // Step 1: Remove "date" from any other column if it exists
      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null; // Clear previous assignment
        }
      }
      // Step 2: Handle "skip" option
      if (value === "skip") {
        value = null;
      }
      // Step 3: Assign "date" to column_0
      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  // = ["date", "payee", null, "amount"]
  // Step 2: Filter out falsy values (null, undefined, "", 0, false)
  // // = ["date", "payee", "amount"]  // null is removed
  // Step 3: Count the length

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      //"_" → ["column", "3"]
      return column.split("_")[1];
    };

    const mappedDate = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    console.log({ mappedDate });
  };

  return (
    <div className="max-w-screen-2xl max-auto w-full pb-10 -mt-24 ">
      <Card className="border-none drop-shadow-sm bg-white/85">
        <CardHeader className="gap-y-2 md:flex md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transactions
          </CardTitle>
          <div className="flex flex-col md:flex-row md:space-x-2 space-x-0 gap-y-2 md:gap-y-0 items-center">
            <Button onClick={onCancel} size="sm" className="w-full md:w-auto">
              Cancel
            </Button>
            <Button
              className="w-full md:w-auto"
              size="sm"
              disabled={progress < requiredOptions.length}
              onClick={handleContinue}
            >
              Continue({progress}/{requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeaderSelectChange={onTableHeaderSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
