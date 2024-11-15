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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SynodeReport = () => {
  const [selectedSynode, setSelectedSynode] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { data: synodes } = useQuery({
    queryKey: ["synodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("synodes")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const { data: attendances, isLoading, refetch } = useQuery({
    queryKey: ["synode-attendance", selectedSynode],
    enabled: !!selectedSynode,
    queryFn: async () => {
      const { data, error } = await supabase
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
            synode_id,
            synodes (
              name,
              color
            )
          )
        `)
        .eq("profiles.synode_id", selectedSynode)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleExport = async () => {
    if (!attendances?.length) return;

    setIsExporting(true);
    try {
      const csvContent = [
        ["Nom", "Prénom", "Synode", "Type", "Date", "Heure", "Durée", "Notes"].join(","),
        ...attendances.map(attendance => [
          attendance.profiles.last_name,
          attendance.profiles.first_name,
          attendance.profiles.synodes.name,
          attendance.type === "entry" ? "Entrée" : "Sortie",
          format(new Date(attendance.timestamp), "dd/MM/yyyy"),
          format(new Date(attendance.timestamp), "HH:mm"),
          attendance.duration || "-",
          attendance.notes || "-"
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `rapport_synode_${format(new Date(), "yyyy-MM-dd")}.csv`);
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
      <div className="flex justify-between items-start">
        <Card className="p-4">
          <Select value={selectedSynode} onValueChange={setSelectedSynode}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner un synode" />
            </SelectTrigger>
            <SelectContent>
              {synodes?.map((synode) => (
                <SelectItem key={synode.id} value={synode.id}>
                  {synode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading || !selectedSynode}
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
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Rapport du synode {synodes?.find(s => s.id === selectedSynode)?.name || ""}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : attendances && attendances.length > 0 ? (
            <AttendanceTable attendances={attendances} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedSynode ? "Aucune présence enregistrée pour ce synode" : "Veuillez sélectionner un synode"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SynodeReport;