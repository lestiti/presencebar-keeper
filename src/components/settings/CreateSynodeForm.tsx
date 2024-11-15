import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateSynodeFormProps {
  onSynodeCreate: () => void;
}

const CreateSynodeForm = ({ onSynodeCreate }: CreateSynodeFormProps) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#33539E");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !color) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('synodes')
        .insert([{ name, color }]);

      if (error) throw error;

      onSynodeCreate();
      setName("");
      setColor("#33539E");
      
      toast({
        title: "Succès",
        description: "Le synode a été créé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du synode",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-600">{color}</span>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Création en cours..." : "Créer le synode"}
      </Button>
    </form>
  );
};

export default CreateSynodeForm;