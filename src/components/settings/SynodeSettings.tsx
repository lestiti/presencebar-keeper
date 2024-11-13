import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Clock, Save } from "lucide-react";

const SynodeSettings = () => {
  const [settings, setSettings] = useState<Record<string, { start: string; end: string }>>({});

  const { data: synodes, isLoading } = useQuery({
    queryKey: ["synodes-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("synodes")
        .select(`
          id,
          name,
          attendance_settings (
            start_time,
            end_time
          )
        `);

      if (error) throw error;
      return data;
    },
  });

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
          <Card key={synode.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{synode.name}</h3>
              <Button
                variant="outline"
                onClick={() => handleSaveSettings(synode.id)}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Heure de début
                </label>
                <Input
                  type="time"
                  value={settings[synode.id]?.start || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [synode.id]: { ...settings[synode.id], start: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Heure de fin
                </label>
                <Input
                  type="time"
                  value={settings[synode.id]?.end || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      [synode.id]: { ...settings[synode.id], end: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SynodeSettings;