import { useCSVReader } from "react-papaparse";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (result: { data: never[]; error: never[]; meta: never[] }) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();

  //TODO:add paywall
  return (
    <CSVReader onUploadAccepted={onUpload}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {({ getRootProps }: any) => (
        <Button size="sm" className="w-full lg:w-auto" {...getRootProps()}>
          <Upload className="size-4 mr-2" />
          Import
        </Button>
      )}
    </CSVReader>
  );
};
