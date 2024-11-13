import { Card } from "@/components/ui/card";
import UserBarcodes from "./UserBarcodes";
import { memo, useState } from "react";
import { Button } from "./ui/button";
import { Trash2, Edit2, Download, ChevronDown, ChevronUp } from "lucide-react";
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
import JSZip from 'jszip';

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
  const [showBarcodes, setShowBarcodes] = useState(false);

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

  const downloadCodesAsZip = async () => {
    const zip = new JSZip();
    
    // Get the barcode and QR code URLs from UserBarcodes component
    const barcodeUrl = await generateBarcode(generateEAN13(parseInt(user.id)), true);
    const qrCodeUrl = await QRCode.toDataURL(user.id, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: 'H'
    });

    // Add files to zip
    zip.file(`${user.name}-barcode.png`, barcodeUrl.split(',')[1], {base64: true});
    zip.file(`${user.name}-qrcode.png`, qrCodeUrl.split(',')[1], {base64: true});

    // Generate zip file
    const content = await zip.generateAsync({type: "blob"});
    
    // Download zip file
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codes-${user.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export réussi",
      description: "Les codes ont été exportés en ZIP",
    });
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in border-l-4 relative group" style={{ borderLeftColor: user.synode }}>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <Button variant="ghost" size="icon" onClick={downloadCodesAsZip} title="Télécharger les codes">
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
        <Button 
          variant="ghost" 
          className="text-center w-full flex items-center justify-between"
          onClick={() => setShowBarcodes(!showBarcodes)}
        >
          <div>
            <h3 className="font-bold text-lg text-primary">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.function}</p>
            <p className="text-sm text-gray-600">{user.phone}</p>
          </div>
          {showBarcodes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {showBarcodes && <UserBarcodes user={user} />}
      </div>
    </Card>
  );
});

UserCard.displayName = "UserCard";

export default UserCard;