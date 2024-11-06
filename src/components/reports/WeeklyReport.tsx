import { Card } from "@/components/ui/card";

interface WeeklyReportProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const WeeklyReport = ({ date, onDateChange }: WeeklyReportProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Rapport Hebdomadaire</h2>
        <p className="text-muted-foreground">En cours de développement</p>
      </Card>
    </div>
  );
};

export default WeeklyReport;