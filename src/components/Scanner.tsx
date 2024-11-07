import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Scan, Camera, Barcode } from "lucide-react";
import { QrReader } from "react-qr-reader";
import { useScannerLogic } from "@/hooks/useScannerLogic";

interface ScannerProps {
  scannerId: number;
}

const Scanner = ({ scannerId }: ScannerProps) => {
  const [code, setCode] = useState("");
  const [useWebcam, setUseWebcam] = useState(false);
  const [usePhysicalScanner, setUsePhysicalScanner] = useState(false);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  
  const { handleScan } = useScannerLogic();

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasWebcamPermission(true);
      toast({
        title: "Webcam activée",
        description: `L'accès à la caméra a été autorisé pour le scanner ${scannerId}`,
      });
    } catch (error) {
      setHasWebcamPermission(false);
      toast({
        title: "Erreur d'accès à la webcam",
        description: "Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur",
        variant: "destructive",
      });
      setUseWebcam(false);
    }
  };

  useEffect(() => {
    if (useWebcam && hasWebcamPermission === null) {
      requestWebcamPermission();
    }
  }, [useWebcam, hasWebcamPermission]);

  useEffect(() => {
    if (usePhysicalScanner) {
      const input = document.getElementById(`barcode-input-${scannerId}`);
      if (input) {
        input.focus();
      }

      toast({
        title: `Scanner physique ${scannerId} activé`,
        description: "Veuillez connecter votre scanner de codes-barres",
      });

      const handleKeyPress = (e: KeyboardEvent) => {
        const input = e.target as HTMLInputElement;
        if (e.key === "Enter" && input.id === `barcode-input-${scannerId}`) {
          handleScan(input.value);
          input.value = "";
        }
      };

      document.addEventListener("keypress", handleKeyPress);
      return () => {
        document.removeEventListener("keypress", handleKeyPress);
      };
    }
  }, [usePhysicalScanner, handleScan, scannerId]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(code);
    setCode("");
  };

  const switchMode = (mode: 'webcam' | 'physical' | 'manual') => {
    if (mode === 'webcam' && hasWebcamPermission === false) {
      toast({
        title: "Accès refusé",
        description: "L'accès à la caméra a été refusé. Veuillez vérifier les paramètres de votre navigateur.",
        variant: "destructive",
      });
      return;
    }
    
    setUseWebcam(mode === 'webcam');
    setUsePhysicalScanner(mode === 'physical');
    setCode("");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        {useWebcam && hasWebcamPermission ? (
          <div className="relative aspect-video max-w-md mx-auto">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={(result) => {
                if (result) {
                  handleScan(result.getText());
                }
              }}
              className="w-full"
              videoId={`video-${scannerId}`}
              scanDelay={500}
            />
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <Input
                id={`barcode-input-${scannerId}`}
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