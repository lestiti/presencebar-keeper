import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2, RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import AttendanceTable from "./AttendanceTable";
import { useToast } from "@/components/ui/use-toast";
import { ReportFilters } from "@/pages/Reports";

interface CustomReportProps {
  filters: ReportFilters;
}

const CustomReport = ({ filters }: CustomReportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: attendances, isLoading, refetch } = useQuery({
    queryKey: ["custom-attendance", filters],
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
        .order("timestamp", { ascending: true });

      if (filters.synode) {
        query = query.eq("profiles.synode_id", filters.synode);
      }

      if (filters.function) {
        query = query.eq("profiles.function", filters.function);
      }

      if (filters.minDuration) {
        query = query.gte("duration", filters.minDuration);
      }

      if (filters.maxDuration) {
        query = query.lte("duration", filters.maxDuration);
      }

      if (filters.searchTerm) {
        query = query.or(
          `first_name.ilike.%${filters.searchTerm}%,last_name.ilike.%${filters.searchTerm}%,notes.ilike.%${filters.searchTerm}%`
        );
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
      link.setAttribute("download", `presences_personnalisees.csv`);
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
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>

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
            Rapport personnalisé
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : attendances && attendances.length > 0 ? (
            <AttendanceTable attendances={attendances} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune présence trouvée avec les filtres sélectionnés
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomReport;