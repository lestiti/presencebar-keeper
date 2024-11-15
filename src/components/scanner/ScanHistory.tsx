import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ScanHistoryProps {
  scannerId: number;
}

interface ScanRecord {
  code: string;
  timestamp: Date;
  type: "entry" | "final_exit";
  userName?: string;
  synodeName?: string;
}

interface ScanEvent extends CustomEvent {
  detail: {
    scannerId: number;
    code: string;
    type: "entry" | "final_exit";
    userName?: string;
    synodeName?: string;
  };
}

const ScanHistory = ({ scannerId }: ScanHistoryProps) => {
  const [history, setHistory] = useState<ScanRecord[]>([]);

  const addScan = (code: string, type: "entry" | "final_exit", userName?: string, synodeName?: string) => {
    setHistory(prev => [
      { code, timestamp: new Date(), type, userName, synodeName },
      ...prev.slice(0, 9) // Keep only last 10 scans
    ]);
  };

  useEffect(() => {
    const handleScan = (event: Event) => {
      const scanEvent = event as ScanEvent;
      if (scanEvent.detail.scannerId === scannerId) {
        addScan(
          scanEvent.detail.code,
          scanEvent.detail.type,
          scanEvent.detail.userName,
          scanEvent.detail.synodeName
        );
      }
    };

    window.addEventListener('scan', handleScan);
    return () => window.removeEventListener('scan', handleScan);
  }, [scannerId]);

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-sm font-semibold mb-2">Historique des scans</h3>
      <ScrollArea className="h-32">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-2">
            Aucun scan enregistré
          </p>
        ) : (
          <div className="space-y-2">
            {history.map((scan, index) => (
              <div
                key={index}
                className="text-sm flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{scan.userName || scan.code}</span>
                  {scan.synodeName && (
                    <span className="text-xs text-gray-500">{scan.synodeName}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    scan.type === "entry" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {scan.type === "entry" ? "Entrée" : "Sortie"}
                  </span>
                  <span className="text-gray-500">
                    {format(scan.timestamp, "HH:mm:ss", { locale: fr })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ScanHistory;