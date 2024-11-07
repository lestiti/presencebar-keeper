import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface PhysicalScannerProps {
  scannerId: number;
  onScan: (code: string) => void;
}

export const PhysicalScanner = ({ scannerId, onScan }: PhysicalScannerProps) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  useEffect(() => {
    const getDevices = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputDevices = devices.filter(device => device.kind === "videoinput");
      setDevices(inputDevices);
      
      if (inputDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(inputDevices[0].deviceId);
      }
    };

    getDevices();

    const input = document.getElementById(`barcode-input-${scannerId}`);
    if (input) {
      input.focus();
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      const input = e.target as HTMLInputElement;
      if (e.key === "Enter" && input.id === `barcode-input-${scannerId}`) {
        onScan(input.value);
        input.value = "";
      }
    };

    document.addEventListener("keypress", handleKeyPress);
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [scannerId, onScan]);

  return (
    <div className="space-y-4">
      <Select
        value={selectedDevice}
        onValueChange={setSelectedDevice}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un périphérique" />
        </SelectTrigger>
        <SelectContent>
          {devices.map((device) => (
            <SelectItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Périphérique ${device.deviceId.slice(0, 8)}...`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        id={`barcode-input-${scannerId}`}
        type="text"
        placeholder="Utilisez votre scanner physique..."
        className="flex-1"
        maxLength={13}
        autoFocus
      />
    </div>
  );
};