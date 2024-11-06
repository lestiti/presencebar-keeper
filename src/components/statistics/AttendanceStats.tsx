import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { AttendanceRecord } from "@/types/attendance";

interface AttendanceStatsProps {
  attendances: AttendanceRecord[];
}

const AttendanceStats = ({ attendances }: AttendanceStatsProps) => {
  // Calculer les statistiques par synode
  const synodeStats = attendances.reduce((acc, curr) => {
    if (!acc[curr.synode]) {
      acc[curr.synode] = { name: curr.synode, count: 0 };
    }
    if (curr.type === "entry") {
      acc[curr.synode].count += 1;
    }
    return acc;
  }, {} as Record<string, { name: string; count: number }>);

  const chartData = Object.values(synodeStats);

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

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Présences par Synode</h3>
        <div className="h-[400px]"> {/* Augmenté la hauteur */}
          <ChartContainer
            config={{
              primary: {
                theme: {
                  light: "#33539E",
                  dark: "#7facd6",
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }} // Ajusté les marges
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60} 
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'Nombre de présences', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]} // Coins arrondis
                />
                <ChartTooltip />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceStats;