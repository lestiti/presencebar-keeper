import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import Scanner from "./Scanner";
import { toast } from "./ui/use-toast";

const MultipleScanner = () => {
  const [scanners, setScanners] = useState([1]);
  const MAX_SCANNERS = 4;

  const addScanner = () => {
    if (scanners.length < MAX_SCANNERS) {
      setScanners([...scanners, scanners.length + 1]);
      toast({
        title: "Scanner ajouté",
        description: `Scanner ${scanners.length + 1} activé`,
      });
    } else {
      toast({
        title: "Limite atteinte",
        description: `Maximum ${MAX_SCANNERS} scanners simultanés`,
        variant: "destructive",
      });
    }
  };

  const removeScanner = () => {
    if (scanners.length > 1) {
      setScanners(scanners.slice(0, -1));
      toast({
        title: "Scanner retiré",
        description: `Scanner ${scanners.length} désactivé`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={removeScanner}
          disabled={scanners.length <= 1}
        >
          <Minus className="h-4 w-4 mr-1" />
          Retirer un scanner
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addScanner}
          disabled={scanners.length >= MAX_SCANNERS}
        >
          <Plus className="h-4 w-4 mr-1" />
          Ajouter un scanner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scanners.map((id) => (
          <div key={id} className="relative">
            <div className="absolute top-0 left-0 bg-primary text-white px-2 py-1 text-sm rounded-tl-lg">
              Scanner {id}
            </div>
            <Scanner scannerId={id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleScanner;