import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Clock, Save, Trash2, Users } from "lucide-react";
import CreateSynodeForm from "./CreateSynodeForm";
import { useState } from "react";

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
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
      });
    }
  };

  const handleDeleteSynode = async (synodeId: string) => {
    try {
      const { error } = await supabase
        .from("synodes")
        .delete()
        .eq("id", synodeId);

      if (error) throw error;

      toast({
        title: "Synode supprimé",
        description: "Le synode a été supprimé avec succès",
      });
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le synode. Vérifiez qu'il n'y a plus d'utilisateurs associés.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Créer un nouveau synode</h2>
        <CreateSynodeForm onSynodeCreate={() => refetch()} />
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Synodes existants</h2>
        <div className="grid gap-6">
          {synodes?.map((synode) => (
            <Card key={synode.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {synode.name}
                    <span className="inline-flex items-center gap-1 text-sm font-normal text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {synode.memberCount} membres
                    </span>
                  </h3>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: synode.color }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSaveSettings(synode.id)}
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={synode.memberCount > 0}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible. Le synode sera définitivement supprimé.
                          Assurez-vous qu'il n'y a plus d'utilisateurs associés à ce synode avant de le supprimer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteSynode(synode.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure de début
                  </Label>
                  <Input
                    type="time"
                    value={settings[synode.id]?.start || ""}
                    onChange={(e) => handleSettingsChange(synode.id, 'start', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Heure de fin
                  </Label>
                  <Input
                    type="time"
                    value={settings[synode.id]?.end || ""}
                    onChange={(e) => handleSettingsChange(synode.id, 'end', e.target.value)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SynodeSettings;