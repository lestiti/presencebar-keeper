import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Camera, Barcode, Scan } from "lucide-react";
import { useScannerLogic } from "@/hooks/useScannerLogic";
import { WebcamScanner } from "./scanner/WebcamScanner";
import { PhysicalScanner } from "./scanner/PhysicalScanner";
import { ManualScanner } from "./scanner/ManualScanner";

interface ScannerProps {
  scannerId: number;
}

const Scanner = ({ scannerId }: ScannerProps) => {
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

  const switchMode = (mode: 'webcam' | 'physical' | 'manual') => {
    if (mode === 'webcam') {
      if (hasWebcamPermission === false) {
        toast({
          title: "Accès refusé",
          description: "L'accès à la caméra a été refusé. Veuillez vérifier les paramètres de votre navigateur.",
          variant: "destructive",
        });
        return;
      }
      if (hasWebcamPermission === null) {
        requestWebcamPermission();
      }
    }
    
    setUseWebcam(mode === 'webcam');
    setUsePhysicalScanner(mode === 'physical');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-6">
        {useWebcam && hasWebcamPermission ? (
          <WebcamScanner scannerId={scannerId} onScan={handleScan} />
        ) : usePhysicalScanner ? (
          <PhysicalScanner scannerId={scannerId} onScan={handleScan} />
        ) : (
          <ManualScanner onScan={handleScan} />
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