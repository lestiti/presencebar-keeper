import { Loader2 } from "lucide-react";
import AttendanceTable from "./AttendanceTable";

interface FunctionReportContentProps {
  isLoading: boolean;
  attendances: any[] | null;
}

const FunctionReportContent = ({ isLoading, attendances }: FunctionReportContentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!attendances || attendances.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune présence enregistrée pour cette période
      </div>
    );
  }

  return <AttendanceTable attendances={attendances} />;
};

export default FunctionReportContent;