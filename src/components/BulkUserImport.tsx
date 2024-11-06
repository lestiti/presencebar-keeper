import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import mammoth from "mammoth";
import { generateEAN13 } from "@/lib/barcodeUtils";

interface UserData {
  name: string;
  phone: string;
  function: string;
  synode: string;
}

const BulkUserImport = ({ onImport }: { onImport: (users: UserData[]) => void }) => {
  const [isLoading, setIsLoading] = useState(false);

  const validateUserData = (userData: Partial<UserData>): userData is UserData => {
    if (!userData.name || !userData.phone || !userData.function || !userData.synode) {
      return false;
    }
    
    // Validate phone number format
    const phoneRegex = /^\+?\d{10,}$/;
    if (!phoneRegex.test(userData.phone.replace(/\s/g, ''))) {
      return false;
    }

    // Validate function
    const validFunctions = ["mpiomana", "mpiandry", "mpampianatra", "iraka"];
    if (!validFunctions.includes(userData.function.toLowerCase())) {
      return false;
    }

    return true;
  };

  const parseWordDocument = async (text: string): Promise<UserData[]> => {
    const lines = text.split('\n').filter(line => line.trim());
    const users: UserData[] = [];
    let currentUser: Partial<UserData> = {};
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('nom') || trimmedLine.toLowerCase().includes('prénom')) {
        if (Object.keys(currentUser).length > 0) {
          if (validateUserData(currentUser)) {
            users.push(currentUser as UserData);
          }
        }
        currentUser = {
          name: trimmedLine.split(':')[1]?.trim() || ''
        };
      } else if (trimmedLine.toLowerCase().includes('téléphone')) {
        currentUser.phone = trimmedLine.split(':')[1]?.trim() || '';
      } else if (trimmedLine.toLowerCase().includes('fonction')) {
        currentUser.function = trimmedLine.split(':')[1]?.trim() || '';
      } else if (trimmedLine.toLowerCase().includes('synode')) {
        currentUser.synode = trimmedLine.split(':')[1]?.trim() || '';
      }
    }

    // Add the last user if valid
    if (Object.keys(currentUser).length > 0 && validateUserData(currentUser)) {
      users.push(currentUser as UserData);
    }

    return users;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const users = await parseWordDocument(result.value);

      if (users.length === 0) {
        toast({
          title: "Erreur d'importation",
          description: "Aucun utilisateur valide n'a été trouvé dans le document",
          variant: "destructive",
        });
        return;
      }

      onImport(users);
      toast({
        title: "Importation réussie",
        description: `${users.length} utilisateur(s) importé(s) avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'importation",
        description: "Une erreur est survenue lors de l'importation du fichier",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-2">Format attendu du document</h3>
        <p className="text-sm text-gray-600 mb-2">Le document Word doit contenir les informations suivantes pour chaque utilisateur :</p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Nom: [Nom complet]</li>
          <li>Téléphone: [Numéro de téléphone]</li>
          <li>Fonction: [mpiomana/mpiandry/mpampianatra/iraka]</li>
          <li>Synode: [Nom du synode]</li>
        </ul>
      </div>

      <div className="flex items-center gap-4">
        <Button
          asChild
          variant="outline"
          className="w-full"
          disabled={isLoading}
        >
          <label className="cursor-pointer">
            {isLoading ? "Importation en cours..." : "Sélectionner un fichier Word"}
            <input
              type="file"
              accept=".docx"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isLoading}
            />
          </label>
        </Button>
      </div>
    </div>
  );
};

export default BulkUserImport;