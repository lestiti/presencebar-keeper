import { useState, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import { AttendanceType } from "@/types/attendance";
import { calculateDuration } from "@/utils/timeUtils";

interface ScanResult {
  type: AttendanceType;
  duration?: string;
}

export const useScannerLogic = () => {
  const [lastScannedCode, setLastScannedCode] = useState("");
  const [lastScanTime, setLastScanTime] = useState(0);
  const [lastScanType, setLastScanType] = useState<AttendanceType | null>(null);
  
  const SCAN_DELAY = 3000;

  const handleAttendanceRecord = async (code: string): Promise<ScanResult | null> => {
    try {
      const currentTime = new Date();
      const newType: AttendanceType = lastScanType === "entry" ? "final_exit" : "entry";
      let duration: string | undefined;

      if (newType === "final_exit" && lastScanTime) {
        duration = calculateDuration(new Date(lastScanTime), currentTime);
      }

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

  const handleScan = useCallback(async (result: string | null): Promise<ScanResult | null> => {
    if (!result) return null;

    const currentTime = Date.now();
    
    if (
      result === lastScannedCode &&
      currentTime - lastScanTime < SCAN_DELAY
    ) {
      return null;
    }

    if (result.length === 13) {
      return handleAttendanceRecord(result);
    } else {
      toast({
        title: "Erreur de scan",
        description: "Le code-barres doit contenir 13 chiffres",
        variant: "destructive",
      });
      return null;
    }
  }, [lastScannedCode, lastScanTime]);

  return {
    handleScan,
    lastScannedCode,
    lastScanType
  };
};