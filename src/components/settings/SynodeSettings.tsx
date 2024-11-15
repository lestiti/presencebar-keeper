import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Clock, Save, Trash2, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SynodeSettings = () => {
  const [settings, setSettings] = useState<Record<string, { start: string; end: string }>>({});
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: synodes, isLoading, refetch } = useQuery({
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

  const handleDeleteSynode = async (synodeId: string) => {
    try {
      setIsDeleting(true);
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le synode. Vérifiez qu'il n'y a plus d'utilisateurs associés.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Paramètres des Synodes</h2>
      
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
                      disabled={isDeleting || synode.memberCount > 0}
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
                        {isDeleting ? "Suppression..." : "Supprimer"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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