import { QrReader } from "react-qr-reader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface WebcamScannerProps {
  scannerId: number;
  onScan: (result: string) => void;
}

export const WebcamScanner = ({ scannerId, onScan }: WebcamScannerProps) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);
        
        if (videoDevices.length > 0 && !selectedDevice) {
          setSelectedDevice(videoDevices[0].deviceId);
        }
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'accéder aux périphériques vidéo",
          variant: "destructive",
        });
      }
    };

    getDevices();
  }, []);

  return (
    <div className="space-y-4">
      <Select
        value={selectedDevice}
        onValueChange={setSelectedDevice}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner une caméra" />
        </SelectTrigger>
        <SelectContent>
          {devices.map((device) => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Caméra ${device.deviceId.slice(0, 8)}...`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative aspect-video max-w-md mx-auto">
        <QrReader
          constraints={{
            deviceId: selectedDevice,
            facingMode: "environment",
          }}
          onResult={(result) => {
            if (result) {
              onScan(result.getText());
            }
          }}
          className="w-full"
          videoId={`video-${scannerId}`}
          scanDelay={500}
        />
      </div>
    </div>
  );
};