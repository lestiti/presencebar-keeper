import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import SynodeCard from "./SynodeCard";

const SynodeSettings = () => {
  const [settings, setSettings] = useState<Record<string, { start: string; end: string }>>({});

  const { data: synodes, refetch } = useQuery({
    queryKey: ["synodes-settings"],
    queryFn: async () => {
      const { data: synodesData, error: synodesError } = await supabase
        .from("synodes")
        .select(`
          id,
          name,
          color,
          attendance_settings (
            start_time,
            end_time
          ),
          profiles (
            id
          )
        `);

      if (synodesError) throw synodesError;
      return synodesData?.map(synode => ({
        ...synode,
        memberCount: synode.profiles?.length || 0
      }));
    },
  });

  const handleSettingsChange = (synodeId: string, field: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      [synodeId]: {
        ...prev[synodeId],
        [field]: value,
      },
    }));
  };

  const handleSaveSettings = async (synodeId: string) => {
    try {
      const { error } = await supabase
        .from("attendance_settings")
        .upsert({
          synode_id: synodeId,
          start_time: settings[synodeId]?.start,
          end_time: settings[synodeId]?.end,
        });

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Les horaires ont été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres des Synodes</h2>
      
      <div className="grid gap-6">
        {synodes?.map((synode) => (
          <SynodeCard
            key={synode.id}
            synode={synode}
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSaveSettings={handleSaveSettings}
            refetch={refetch}
          />
        ))}
      </div>
    </div>
  );
};

export default SynodeSettings;