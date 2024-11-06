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
import type { Synode } from "@/types/synode";

const FUNCTIONS = ["mpiomana", "mpiandry", "mpampianatra", "iraka"] as const;

interface UserRegistrationFormProps {
  onSubmit: (userData: {
    name: string;
    phone: string;
    function: string;
    synode: string;
  }) => void;
  synodes: Synode[];
}

const UserRegistrationForm = ({ onSubmit, synodes }: UserRegistrationFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userFunction, setUserFunction] = useState<string>("");
  const [selectedSynode, setSelectedSynode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !userFunction || !selectedSynode) {
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
      synode: selectedSynode,
    });

    setName("");
    setPhone("");
    setUserFunction("");
    setSelectedSynode("");
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
        <Select value={selectedSynode} onValueChange={setSelectedSynode}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un synode" />
          </SelectTrigger>
          <SelectContent>
            {synodes.map((synode) => (
              <SelectItem key={synode.id} value={synode.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: synode.color }}
                  />
                  {synode.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Enregistrer
      </Button>
    </form>
  );
};

export default UserRegistrationForm;