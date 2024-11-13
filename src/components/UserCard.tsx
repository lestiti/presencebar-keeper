import { Card } from "@/components/ui/card";
import UserBarcodes from "./UserBarcodes";
import { memo, useState } from "react";
import { Button } from "./ui/button";
import { Trash2, Edit2, Download } from "lucide-react";
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
import { toast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    function: string;
    synode: string;
    phone: string;
  };
}

const UserCard = memo(({ user }: UserCardProps) => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
      
      // Refresh users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const exportUserData = () => {
    const data = {
      ...user,
      exportDate: new Date().toLocaleString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-${user.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export réussi",
      description: "Les données de l'utilisateur ont été exportées",
    });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in border-l-4 relative group" style={{ borderLeftColor: user.synode }}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button variant="ghost" size="icon" onClick={exportUserData} title="Exporter les données">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" title="Modifier l'utilisateur">
          <Edit2 className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isDeleting}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Cela supprimera définitivement l'utilisateur
                et toutes ses données associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isDeleting ? "Suppression..." : "Supprimer"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h3 className="font-bold text-lg text-primary">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.function}</p>
          <p className="text-sm text-gray-600">{user.phone}</p>
        </div>
        <UserBarcodes user={user} />
      </div>
    </Card>
  );
});

UserCard.displayName = "UserCard";

export default UserCard;