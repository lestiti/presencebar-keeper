import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import type { Synode } from "@/types/synode";

interface SynodeManagerProps {
  onSynodeCreate: (synode: Omit<Synode, "id">) => void;
}

const SynodeManager = ({ onSynodeCreate }: SynodeManagerProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#33539E");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !color) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    onSynodeCreate({ name, color });
    setName("");
    setColor("#33539E");
    
    toast({
      title: "Succès",
      description: "Le synode a été créé avec succès",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du synode</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom du synode"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="color">Couleur</Label>
        <div className="flex gap-4 items-center">
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-20 h-10"
          />
          <span className="text-sm text-gray-600">{color}</span>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Créer le synode
      </Button>
    </form>
  );
};

export default SynodeManager;