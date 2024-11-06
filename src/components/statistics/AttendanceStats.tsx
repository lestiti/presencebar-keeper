import { Card } from "@/components/ui/card";
import { AttendanceRecord } from "@/types/attendance";

interface AttendanceStatsProps {
  attendances: AttendanceRecord[];
}

const AttendanceStats = ({ attendances }: AttendanceStatsProps) => {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Présences</h3>
          <p className="text-3xl font-bold">
            {attendances.filter(a => a.type === "entry").length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Sorties</h3>
          <p className="text-3xl font-bold">
            {attendances.filter(a => a.type === "final_exit").length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Durée Moyenne</h3>
          <p className="text-3xl font-bold">
            {attendances
              .filter(a => a.duration)
              .reduce((acc, curr) => acc + (curr.duration ? parseFloat(curr.duration.replace('h', '.').replace('min', '')) : 0), 0) / 
              attendances.filter(a => a.duration).length || 0}h
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceStats;