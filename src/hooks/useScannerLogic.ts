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
  
  const SCAN_DELAY = 3000; // 3 seconds delay between scans

  const handleAttendanceRecord = async (code: string): Promise<ScanResult | null> => {
    try {
      const currentTime = new Date();
      const newType: AttendanceType = lastScanType === "entry" ? "final_exit" : "entry";
      let duration: string | undefined;

      if (newType === "final_exit" && lastScanTime) {
        duration = calculateDuration(new Date(lastScanTime), currentTime);
      }

      setLastScannedCode(code);
      setLastScanTime(currentTime.getTime());
      setLastScanType(newType);
      
      return { type: newType, duration };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la présence:', error);
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
    
    // Prevent duplicate scans within SCAN_DELAY milliseconds
    if (
      result === lastScannedCode &&
      currentTime - lastScanTime < SCAN_DELAY
    ) {
      return null;
    }

    // Handle both barcode (13 digits) and QR code (UUID format)
    const isBarcode = /^\d{13}$/.test(result);
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result);

    if (isBarcode || isUUID) {
      return handleAttendanceRecord(result);
    } else {
      toast({
        title: "Format invalide",
        description: "Le code scanné n'est pas dans un format valide",
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