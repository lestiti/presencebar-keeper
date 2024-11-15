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

  const handleColorChange = (value: string) => {
    // Validate hex color format
    if (/^#[0-9A-F]{6}$/i.test(value) || value.length <= 7) {
      setColor(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !color || !/^#[0-9A-F]{6}$/i.test(color)) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs avec des valeurs valides",
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
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-20 h-10"
            disabled={isSubmitting}
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#33539E"
            className="w-32"
            maxLength={7}
            disabled={isSubmitting}
          />
          <div 
            className="w-10 h-10 rounded border"
            style={{ backgroundColor: /^#[0-9A-F]{6}$/i.test(color) ? color : '#33539E' }}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Création en cours..." : "Créer le synode"}
      </Button>
    </form>
  );
};

export default CreateSynodeForm;