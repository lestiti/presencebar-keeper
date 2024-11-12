import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface FunctionReportHeaderProps {
  startDate: Date;
  endDate: Date;
}

const FunctionReportHeader = ({ startDate, endDate }: FunctionReportHeaderProps) => {
  return (
    <h2 className="text-xl font-semibold mb-4">
      Rapport par fonction du {format(startDate, "d MMMM yyyy", { locale: fr })} au{" "}
      {format(endDate, "d MMMM yyyy", { locale: fr })}
    </h2>
  );
};

export default FunctionReportHeader;