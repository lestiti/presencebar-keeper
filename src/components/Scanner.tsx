import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Scan } from "lucide-react";

const Scanner = () => {
  const [code, setCode] = useState("");

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 13) {
      toast({
        title: "Présence enregistrée",
        description: `Code scanné: ${code}`,
      });
      setCode("");
    } else {
      toast({
        title: "Erreur de scan",
        description: "Le code-barres doit contenir 13 chiffres",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">Scanner de Présence</h2>
      <form onSubmit={handleScan} className="space-y-4">
        <div className="flex space-x-4">
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Scanner ou entrer le code-barres"
            className="flex-1"
            maxLength={13}
          />
          <Button type="submit">
            <Scan className="mr-2 h-4 w-4" />
            Scanner
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Scanner;