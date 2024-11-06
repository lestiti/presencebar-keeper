import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Scan, Camera } from "lucide-react";
import { QrReader } from "react-qr-reader";

const Scanner = () => {
  const [code, setCode] = useState("");
  const [useWebcam, setUseWebcam] = useState(false);

  const handleScan = (result: string | null) => {
    if (result) {
      if (result.length === 13) {
        toast({
          title: "Présence enregistrée",
          description: `Code scanné: ${result}`,
        });
        setCode("");
      } else {
        toast({
          title: "Erreur de scan",
          description: "Le code-barres doit contenir 13 chiffres",
          variant: "destructive",
        });
      }
    }
  };

  const handleError = (error: Error) => {
    toast({
      title: "Erreur de caméra",
      description: error.message,
      variant: "destructive",
    });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 13) {
      handleScan(code);
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
      
      <div className="space-y-6">
        {useWebcam ? (
          <div className="relative aspect-video max-w-md mx-auto">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result) => result && handleScan(result.getText())}
              onError={handleError}
              className="w-full"
            />
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
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
        )}

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setUseWebcam(!useWebcam)}
            className="w-full max-w-xs"
          >
            <Camera className="mr-2 h-4 w-4" />
            {useWebcam ? "Utiliser le scanner manuel" : "Utiliser la webcam"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;