import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Barcode } from "lucide-react";
import { generateBarcode, generateEAN13 } from "@/lib/barcodeUtils";
import QRCode from "qrcode";

interface UserBarcodesProps {
  user: {
    id: string;
    name: string;
  };
}

const UserBarcodes = ({ user }: UserBarcodesProps) => {
  const [barcodeUrl, setBarcodeUrl] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const generateCodes = async () => {
      // Generate EAN13 barcode
      const ean13Code = generateEAN13(parseInt(user.id));
      const barcode = generateBarcode(ean13Code, true);
      setBarcodeUrl(barcode);

      // Generate QR code
      try {
        const qrCode = await QRCode.toDataURL(user.id, {
          width: 400,
          margin: 2,
          errorCorrectionLevel: 'H'
        });
        setQrCodeUrl(qrCode);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };

    generateCodes();
  }, [user.id]);

  const handleDownload = (url: string, type: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-${user.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Barcode className="h-4 w-4" />
            Code-barres EAN-13
          </h3>
          <div className="relative w-full max-w-[300px]">
            {barcodeUrl && (
              <img
                src={barcodeUrl}
                alt={`Code-barres de ${user.name}`}
                className="w-full"
              />
            )}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-0 right-0 m-2"
              onClick={() => handleDownload(barcodeUrl, 'barcode')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Code
          </h3>
          <div className="relative w-full max-w-[300px]">
            {qrCodeUrl && (
              <img
                src={qrCodeUrl}
                alt={`QR code de ${user.name}`}
                className="w-full"
              />
            )}
            <Button
              variant="outline"
              size="sm"
              className="absolute top-0 right-0 m-2"
              onClick={() => handleDownload(qrCodeUrl, 'qrcode')}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserBarcodes;