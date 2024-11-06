import { Card } from "@/components/ui/card";
import { generateBarcode, generateEAN13 } from "@/lib/barcodeUtils";
import { useEffect, useState } from "react";

interface UserCardProps {
  user: {
    id: number;
    name: string;
    function: string;
    synode: string;
    phone: string;
  };
}

const UserCard = ({ user }: UserCardProps) => {
  const [barcodeUrl, setBarcodeUrl] = useState<string>("");

  useEffect(() => {
    // Generate a valid EAN13 code first
    const ean13Code = generateEAN13(user.id);
    // Then generate the barcode image
    const barcode = generateBarcode(ean13Code);
    setBarcodeUrl(barcode);
  }, [user.id]);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={barcodeUrl}
          alt={`Code-barres de ${user.name}`}
          className="w-full max-w-[200px]"
        />
        <div className="text-center">
          <h3 className="font-bold text-lg text-primary">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.function}</p>
          <p className="text-sm text-gray-600">{user.synode}</p>
          <p className="text-sm text-gray-600">{user.phone}</p>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;