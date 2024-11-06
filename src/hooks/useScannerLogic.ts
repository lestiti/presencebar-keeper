import { useState, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { AttendanceType } from "@/types/attendance";
import { calculateDuration } from "@/utils/timeUtils";

export const useScannerLogic = () => {
  const [lastScannedCode, setLastScannedCode] = useState("");
  const [lastScanTime, setLastScanTime] = useState(0);
  const [lastScanType, setLastScanType] = useState<AttendanceType | null>(null);
  
  // Délai minimum entre deux scans du même code (3 secondes)
  const SCAN_DELAY = 3000;

  const handleAttendanceRecord = async (code: string) => {
    try {
      const currentTime = new Date();
      const newType: AttendanceType = lastScanType === "entry" ? "final_exit" : "entry";
      let duration: string | undefined;

      if (newType === "final_exit" && lastScanTime) {
        duration = calculateDuration(new Date(lastScanTime), currentTime);
      }

      // Ici, vous implémenteriez l'appel à votre API pour enregistrer la présence
      console.log(`Enregistrement: ${code}, type: ${newType}${duration ? `, durée: ${duration}` : ''}`);
      
      const message = newType === "entry" 
        ? "Entrée enregistrée"
        : `Sortie enregistrée (Durée: ${duration})`;

      toast({
        title: "Présence enregistrée",
        description: message,
      });

      setLastScannedCode(code);
      setLastScanTime(currentTime.getTime());
      setLastScanType(newType);
      
      return { type: newType, duration };
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la présence",
        variant: "destructive",
      });
      return null;
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
      handleAttendanceRecord(result);
    } else {
      toast({
        title: "Erreur de scan",
        description: "Le code-barres doit contenir 13 chiffres",
        variant: "destructive",
      });
    }
  }, [lastScannedCode, lastScanTime]);

  return {
    handleScan,
    lastScannedCode,
    lastScanType
  };
};