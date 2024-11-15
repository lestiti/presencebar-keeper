import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SynodeCardProps {
  synode: {
    id: string;
    name: string;
    color: string;
    memberCount: number;
  };
  settings: Record<string, { start: string; end: string }>;
  onSettingsChange: (synodeId: string, field: 'start' | 'end', value: string) => void;
  onSaveSettings: (synodeId: string) => void;
  refetch: () => void;
}

const SynodeCard = ({ synode, settings, onSettingsChange, onSaveSettings, refetch }: SynodeCardProps) => {
  const handleDeleteSynode = async () => {
    try {
      const { error } = await supabase
        .from("synodes")
        .delete()
        .eq("id", synode.id);

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
    <Card className="p-6">
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
            onClick={() => onSaveSettings(synode.id)}
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
                  onClick={handleDeleteSynode}
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
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Heure de début
          </label>
          <Input
            type="time"
            value={settings[synode.id]?.start || ""}
            onChange={(e) => onSettingsChange(synode.id, 'start', e.target.value)}
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
            onChange={(e) => onSettingsChange(synode.id, 'end', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default SynodeCard;