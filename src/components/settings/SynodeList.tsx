import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SynodeListProps {
  synodes: Array<{
    id: string;
    name: string;
    color: string;
    memberCount: number;
  }>;
  refetch: () => void;
}

const SynodeList = ({ synodes, refetch }: SynodeListProps) => {
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SynodeList;