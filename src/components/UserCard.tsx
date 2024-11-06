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
    const ean13Code = generateEAN13(user.id);
    const barcode = generateBarcode(ean13Code);
    setBarcodeUrl(barcode);
  }, [user.id]);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in border-l-4" style={{ borderLeftColor: user.synode }}>
      <div className="flex flex-col items-center space-y-4">
        <img
          src={barcodeUrl}
          alt={`Code-barres de ${user.name}`}
          className="w-full max-w-[200px]"
        />
        <div className="text-center">
          <h3 className="font-bold text-lg text-primary">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.function}</p>
          <p className="text-sm text-gray-600">{user.phone}</p>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;