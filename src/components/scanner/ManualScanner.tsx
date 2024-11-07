import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { useState } from "react";

interface ManualScannerProps {
  onScan: (code: string) => void;
}

export const ManualScanner = ({ onScan }: ManualScannerProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScan(code);
    setCode("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Scanner ou entrer le code-barres"
          className="flex-1"
          maxLength={13}
        />
        <Button type="submit">
          <Scan className="mr-2 h-4 w-4" />
          Scanner
        </Button>
      </div>
    </form>
  );
};