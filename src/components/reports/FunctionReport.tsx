import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import DateRangeSelector from "./DateRangeSelector";
import FunctionSelector from "./FunctionSelector";
import FunctionReportActions from "./FunctionReportActions";
import FunctionReportHeader from "./FunctionReportHeader";
import FunctionReportContent from "./FunctionReportContent";

const FunctionReport = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedFunction, setSelectedFunction] = useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: functions } = useQuery({
    queryKey: ["functions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("function")
        .not("function", "is", null)
        .order("function");

      if (error) throw error;
      const uniqueFunctions = [...new Set(data.map(d => d.function))].filter(Boolean);
      return uniqueFunctions;
    },
  });

  const { data: attendances, isLoading, refetch } = useQuery({
    queryKey: ["function-attendance", startDate, endDate, selectedFunction],
    queryFn: async () => {
      let query = supabase
        .from("attendances")
        .select(`
          id,
          type,
          timestamp,
          duration,
          user_id,
          notes,
          profiles (
            first_name,
            last_name,
            function,
            synode_id,
            synodes (
              name,
              color
            )
          )
        `)
        .gte("timestamp", startDate.toISOString())
        .lte("timestamp", endDate.toISOString())
        .order("timestamp", { ascending: true });

      if (selectedFunction !== "all") {
        query = query.eq("profiles.function", selectedFunction);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les présences",
        });
        throw error;
      }
      return data;
    },
  });

  const handleExport = async () => {
    if (!attendances?.length) return;

    setIsExporting(true);
    try {
      const csvContent = [
        ["Nom", "Prénom", "Fonction", "Synode", "Type", "Date", "Heure", "Durée", "Notes"].join(","),
        ...attendances.map(attendance => [
          attendance.profiles.last_name,
          attendance.profiles.first_name,
          attendance.profiles.function || "-",
          attendance.profiles.synodes.name,
          attendance.type === "entry" ? "Entrée" : 
          attendance.type === "final_exit" ? "Sortie" : 
          attendance.type === "temporary_exit" ? "Sortie temporaire" : "Retour",
          format(new Date(attendance.timestamp), "dd/MM/yyyy"),
          format(new Date(attendance.timestamp), "HH:mm"),
          attendance.duration?.toString() || "-",
          attendance.notes || "-"
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `presences_par_fonction_${format(startDate, "yyyy-MM-dd")}_${format(endDate, "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export réussi",
        description: "Le fichier CSV a été téléchargé",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "L'export a échoué",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start gap-4">
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <div className="space-y-4">
          <FunctionSelector
            selectedFunction={selectedFunction}
            functions={functions}
            onFunctionChange={setSelectedFunction}
          />

          <FunctionReportActions
            isExporting={isExporting}
            isLoading={isLoading}
            hasData={!!attendances?.length}
            onRefresh={refetch}
            onExport={handleExport}
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="p-6">
          <FunctionReportHeader startDate={startDate} endDate={endDate} />
          <FunctionReportContent isLoading={isLoading} attendances={attendances} />
        </div>
      </div>
    </div>
  );
};

export default FunctionReport;