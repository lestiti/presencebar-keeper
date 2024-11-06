import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Scan, Camera, Barcode } from "lucide-react";
import { QrReader } from "react-qr-reader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AttendanceType } from "@/types/attendance";

const Scanner = () => {
  const [code, setCode] = useState("");
  const [useWebcam, setUseWebcam] = useState(false);
  const [usePhysicalScanner, setUsePhysicalScanner] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState("");
  const [lastScanTime, setLastScanTime] = useState(0);
  const [hasWebcamPermission, setHasWebcamPermission] = useState<boolean | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [pendingCode, setPendingCode] = useState<string | null>(null);

  // Délai minimum entre deux scans du même code (3 secondes)
  const SCAN_DELAY = 3000;
  // Délai pour considérer une sortie comme temporaire (30 minutes)
  const TEMPORARY_EXIT_THRESHOLD = 30 * 60 * 1000;

  const requestWebcamPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasWebcamPermission(true);
      toast({
        title: "Webcam activée",
        description: "L'accès à la caméra a été autorisé",
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

  const handleAttendanceRecord = async (code: string, type: AttendanceType) => {
    try {
      // Ici, vous implémenteriez l'appel à votre API pour enregistrer la présence
      console.log(`Enregistrement de présence: ${code}, type: ${type}`);
      
      const message = type === "entry" 
        ? "Entrée enregistrée"
        : type === "temporary_exit"
        ? "Sortie temporaire enregistrée"
        : "Sortie définitive enregistrée";

      toast({
        title: "Présence enregistrée",
        description: message,
      });

      setLastScannedCode(code);
      setLastScanTime(Date.now());
      setCode("");
      setShowExitDialog(false);
      setPendingCode(null);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la présence",
        variant: "destructive",
      });
    }
  };

  const handleScan = useCallback((result: string | null) => {
    if (!result) return;

    const currentTime = Date.now();
    
    if (
      result === lastScannedCode &&
      currentTime - lastScanTime < SCAN_DELAY
    ) {
      return;
    }

    if (result.length === 13) {
      // Vérifier si c'est une sortie potentielle
      const lastScan = lastScannedCode === result ? lastScanTime : 0;
      const timeSinceLastScan = currentTime - lastScan;

      if (lastScan && timeSinceLastScan < TEMPORARY_EXIT_THRESHOLD) {
        setPendingCode(result);
        setShowExitDialog(true);
      } else {
        handleAttendanceRecord(result, "entry");
      }
    } else {
      toast({
        title: "Erreur de scan",
        description: "Le code-barres doit contenir 13 chiffres",
        variant: "destructive",
      });
    }
  }, [lastScannedCode, lastScanTime]);

  useEffect(() => {
    if (useWebcam && hasWebcamPermission === null) {
      requestWebcamPermission();
    }
  }, [useWebcam, hasWebcamPermission]);

  useEffect(() => {
    if (usePhysicalScanner) {
      const input = document.getElementById("barcode-input");
      if (input) {
        input.focus();
      }

      toast({
        title: "Scanner physique activé",
        description: "Veuillez connecter votre scanner de codes-barres",
      });

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
  }, [usePhysicalScanner, handleScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(code);
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
    setLastScannedCode("");
    setLastScanTime(0);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">Scanner de Présence</h2>
      
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

      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Type de sortie</DialogTitle>
            <DialogDescription>
              S'agit-il d'une sortie temporaire ou définitive ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (pendingCode) {
                  handleAttendanceRecord(pendingCode, "temporary_exit");
                }
              }}
            >
              Sortie temporaire
            </Button>
            <Button
              onClick={() => {
                if (pendingCode) {
                  handleAttendanceRecord(pendingCode, "final_exit");
                }
              }}
            >
              Sortie définitive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Scanner;