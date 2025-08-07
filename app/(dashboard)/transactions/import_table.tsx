import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableHeadSelect } from "./table_head_select";

type Props = {
  headers: string[];
  body: string[][];
  selectedColumns: Record<string, string | null>;
  onTableHeaderSelectChange: (
    columnIndex: number,
    value: string | null
  ) => void;
};

export const ImportTable = ({
  headers,
  body,
  selectedColumns,
  onTableHeaderSelectChange,
}: Props) => {
  return (
    <div className="rounded-md border overflow-hidden border-[#31363F]">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="border-b-0 border-[#31363F]">
            {headers.map((_item, index) => (
              <TableHead key={index}>
                <TableHeadSelect
                  columnIndex={index}
                  selectedColumns={selectedColumns}
                  onChange={onTableHeaderSelectChange}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {body.map((row: string[], index) => (
            <TableRow key={index}>
              {row.map((cell, index) => (
                <TableCell key={index}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
