import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const FUNCTIONS = ["mpiomana", "mpiandry", "mpampianatra", "iraka"] as const;

interface UserRegistrationFormProps {
  onSubmit: (userData: {
    name: string;
    phone: string;
    function: string;
    synode: string;
  }) => void;
}

const UserRegistrationForm = ({ onSubmit }: UserRegistrationFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userFunction, setUserFunction] = useState<string>("");
  const [synode, setSynode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !userFunction || !synode) {
      toast({
        title: "Erreur de formulaire",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      name,
      phone,
      function: userFunction,
      synode,
    });

    // Reset form
    setName("");
    setPhone("");
    setUserFunction("");
    setSynode("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nom et prénom
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom complet"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Numéro de téléphone
        </label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+261 34 00 000 00"
        />
      </div>

      <div>
        <label htmlFor="function" className="block text-sm font-medium mb-1">
          Fonction
        </label>
        <Select value={userFunction} onValueChange={setUserFunction}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une fonction" />
          </SelectTrigger>
          <SelectContent>
            {FUNCTIONS.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="synode" className="block text-sm font-medium mb-1">
          Synode
        </label>
        <Input
          id="synode"
          value={synode}
          onChange={(e) => setSynode(e.target.value)}
          placeholder="Synode"
        />
      </div>

      <Button type="submit" className="w-full">
        Enregistrer
      </Button>
    </form>
  );
};

export default UserRegistrationForm;