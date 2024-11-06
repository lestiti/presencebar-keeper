import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { RefreshCcw, Loader2 } from "lucide-react"; // Added Loader2 import
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AttendanceTable from "./AttendanceTable";
import ExportButton from "./ExportButton";
import DateRangeSelector from "./DateRangeSelector";

const CustomReport = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedSynode, setSelectedSynode] = useState<string>("all");
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
    queryKey: ["custom-attendance", startDate, endDate, selectedSynode],
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

      if (selectedSynode !== "all") {
        query = query.eq("profiles.synode_id", selectedSynode);
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
          <Select value={selectedSynode} onValueChange={setSelectedSynode}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner un synode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les synodes</SelectItem>
              {synodes?.map((synode) => (
                <SelectItem key={synode.id} value={synode.id}>
                  {synode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Actualiser
            </Button>

            <ExportButton
              attendances={attendances || []}
              isExporting={isExporting}
              onExport={() => setIsExporting(false)}
              filename={`presences_${format(startDate, "yyyy-MM-dd")}_${format(endDate, "yyyy-MM-dd")}.csv`}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Rapport du {format(startDate, "d MMMM yyyy", { locale: fr })} au {format(endDate, "d MMMM yyyy", { locale: fr })}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : attendances && attendances.length > 0 ? (
            <AttendanceTable attendances={attendances} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune présence enregistrée pour cette période
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomReport;