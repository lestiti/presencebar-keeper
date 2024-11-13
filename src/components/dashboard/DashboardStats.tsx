import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: attendances, error } = await supabase
        .from("attendances")
        .select(`
          id,
          type,
          timestamp,
          profiles (
            first_name,
            last_name,
            function,
            synodes (
              name
            )
          )
        `)
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) throw error;
      return attendances;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const attendancesByFunction = stats?.reduce((acc: any, curr) => {
    const func = curr.profiles.function || "Non défini";
    acc[func] = (acc[func] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(attendancesByFunction || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Présences</h3>
          <p className="text-3xl font-bold">
            {stats?.filter((a) => a.type === "entry").length || 0}
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Présences Aujourd'hui</h3>
          <p className="text-3xl font-bold">
            {stats?.filter((a) => {
              const today = new Date().toISOString().split("T")[0];
              return (
                a.type === "entry" &&
                new Date(a.timestamp).toISOString().split("T")[0] === today
              );
            }).length || 0}
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Fonctions Actives</h3>
          <p className="text-3xl font-bold">
            {Object.keys(attendancesByFunction || {}).length}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Présences par Fonction</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardStats;