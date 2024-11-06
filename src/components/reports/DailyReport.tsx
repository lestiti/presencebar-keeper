import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AttendanceTable from "./AttendanceTable";

interface DailyReportProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const DailyReport = ({ date, onDateChange }: DailyReportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const { data: attendances, isLoading } = useQuery({
    queryKey: ["daily-attendance", date],
    queryFn: async () => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("attendances")
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            synodes:synode_id (
              name,
              color
            )
          )
        `)
        .gte("timestamp", startOfDay.toISOString())
        .lte("timestamp", endOfDay.toISOString())
        .order("timestamp", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Implementation of export logic here
      // This would generate CSV/Excel file
      setIsExporting(false);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <Card className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && onDateChange(date)}
            className="rounded-md border"
            locale={fr}
          />
        </Card>

        <Button
          onClick={handleExport}
          disabled={isExporting || isLoading || !attendances?.length}
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Exporter
        </Button>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Rapport du {format(date, "EEEE d MMMM yyyy", { locale: fr })}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AttendanceTable attendances={attendances || []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyReport;