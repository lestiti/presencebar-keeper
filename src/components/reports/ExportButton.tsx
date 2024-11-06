import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { generateCSVContent } from "@/utils/csvExport";

interface ExportButtonProps {
  attendances: any[];
  isExporting: boolean;
  onExport: () => void;
  filename: string;
}

const ExportButton = ({ attendances, isExporting, onExport, filename }: ExportButtonProps) => {
  const handleExport = () => {
    if (!attendances?.length) return;
    
    const csvContent = generateCSVContent(attendances);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onExport();
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting || !attendances?.length}
    >
      {isExporting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Exporter
    </Button>
  );
};

export default ExportButton;