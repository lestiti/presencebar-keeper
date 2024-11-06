import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Scan, Camera, Barcode } from "lucide-react";
import { QrReader } from "react-qr-reader";

const Scanner = () => {
  const [code, setCode] = useState("");
  const [useWebcam, setUseWebcam] = useState(false);
  const [usePhysicalScanner, setUsePhysicalScanner] = useState(false);

  useEffect(() => {
    if (usePhysicalScanner) {
      // Focus on input when physical scanner mode is active
      const input = document.getElementById("barcode-input");
      if (input) {
        input.focus();
      }

      // Handle physical scanner input
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
          const input = e.target as HTMLInputElement;
          handleScan(input.value);
          input.value = "";
        }
      };

      document.addEventListener("keypress", handleKeyPress);
      return () => {
        document.removeEventListener("keypress", handleKeyPress);
      };
    }
  }, [usePhysicalScanner]);

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

  const switchMode = (mode: 'webcam' | 'physical' | 'manual') => {
    setUseWebcam(mode === 'webcam');
    setUsePhysicalScanner(mode === 'physical');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">Scanner de Présence</h2>
      
      <div className="space-y-6">
        {useWebcam ? (
          <div className="relative aspect-video max-w-md mx-auto">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result) => {
                if (result) {
                  handleScan(result.getText());
                }
              }}
              className="w-full"
              videoId="video"
              scanDelay={500}
            />
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <Input
                id="barcode-input"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={usePhysicalScanner ? "Utilisez votre scanner physique..." : "Scanner ou entrer le code-barres"}
                className="flex-1"
                maxLength={13}
                autoFocus={usePhysicalScanner}
              />
              <Button type="submit" disabled={usePhysicalScanner}>
                <Scan className="mr-2 h-4 w-4" />
                Scanner
              </Button>
            </div>
          </form>
        )}

        <div className="flex justify-center gap-4">
          <Button
            variant={useWebcam ? "default" : "outline"}
            onClick={() => switchMode('webcam')}
            className="flex-1"
          >
            <Camera className="mr-2 h-4 w-4" />
            Webcam
          </Button>
          <Button
            variant={usePhysicalScanner ? "default" : "outline"}
            onClick={() => switchMode('physical')}
            className="flex-1"
          >
            <Barcode className="mr-2 h-4 w-4" />
            Scanner Physique
          </Button>
          <Button
            variant={(!useWebcam && !usePhysicalScanner) ? "default" : "outline"}
            onClick={() => switchMode('manual')}
            className="flex-1"
          >
            <Scan className="mr-2 h-4 w-4" />
            Manuel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;