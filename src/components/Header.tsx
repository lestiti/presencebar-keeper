import { Bell, Menu, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

const Header = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<{
    userId: number;
    name: string;
    days: number;
    lastSeen: Date;
  }[]>([]);

  // Simuler la vérification des absences (à remplacer par une vraie API)
  useEffect(() => {
    const checkAbsences = () => {
      const currentDate = new Date();
      const mockAbsences = [
        {
          userId: 1,
          name: "Jean Dupont",
          days: 3,
          lastSeen: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000),
        },
        {
          userId: 2,
          name: "Marie Martin",
          days: 5,
          lastSeen: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
      ];
      setNotifications(mockAbsences);
    };

    checkAbsences();
  }, []);

  return (
    <header className="bg-primary text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">Gestion de Présence</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Users className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-lg">
              <DropdownMenuItem 
                onClick={() => navigate("/users")}
                className="hover:bg-gray-100 cursor-pointer text-gray-800"
              >
                Gestion des Utilisateurs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white relative">
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-lg w-80">
              {notifications.length === 0 ? (
                <DropdownMenuItem className="text-gray-600">
                  Aucune alerte d'absence
                </DropdownMenuItem>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.userId}
                    className="flex flex-col items-start p-3 hover:bg-gray-100 cursor-pointer text-gray-800"
                  >
                    <div className="font-semibold">{notif.name}</div>
                    <div className="text-sm text-gray-600">
                      Absent depuis {notif.days} jours
                    </div>
                    <div className="text-xs text-gray-500">
                      Dernière présence : {notif.lastSeen.toLocaleDateString()}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="text-white">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;