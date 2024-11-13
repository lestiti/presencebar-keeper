import { Card } from "@/components/ui/card";
import UserBarcodes from "./UserBarcodes";
import { memo } from "react";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    function: string;
    synode: string;
    phone: string;
  };
}

const UserCard = memo(({ user }: UserCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in border-l-4" style={{ borderLeftColor: user.synode }}>
      <div className="flex flex-col space-y-4">
        <div className="text-center">
          <h3 className="font-bold text-lg text-primary">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.function}</p>
          <p className="text-sm text-gray-600">{user.phone}</p>
        </div>
        <UserBarcodes user={user} />
      </div>
    </Card>
  );
});

UserCard.displayName = "UserCard";

export default UserCard;