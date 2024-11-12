import { Button } from "@/components/ui/button";
import { Download, Loader2, RefreshCcw } from "lucide-react";

interface FunctionReportActionsProps {
  isExporting: boolean;
  isLoading: boolean;
  hasData: boolean;
  onRefresh: () => void;
  onExport: () => void;
}

const FunctionReportActions = ({
  isExporting,
  isLoading,
  hasData,
  onRefresh,
  onExport,
}: FunctionReportActionsProps) => {
  return (
    <div className="space-x-2">
      <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Actualiser
      </Button>

      <Button onClick={onExport} disabled={isExporting || isLoading || !hasData}>
        {isExporting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        Exporter
      </Button>
    </div>
  );
};

export default FunctionReportActions;