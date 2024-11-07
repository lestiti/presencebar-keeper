import { Bell, Menu, User, Users, LogIn } from "lucide-react";
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
import { useRolePermissions } from "@/hooks/useRolePermissions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { permissions } = useRolePermissions();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState<{
    userId: number;
    name: string;
    days: number;
    lastSeen: Date;
  }[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session) {
        setUser(session.user);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Erreur lors de la déconnexion",
        description: error.message || "Veuillez réessayer",
        variant: "destructive",
      });
    }
  };

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
          {user && (permissions?.canManageUsers || permissions?.canViewAllReports) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Users className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-lg">
                {permissions?.canManageUsers && (
                  <DropdownMenuItem 
                    onClick={() => navigate("/users")}
                    className="hover:bg-gray-100 cursor-pointer text-gray-800"
                  >
                    Gestion des Utilisateurs
                  </DropdownMenuItem>
                )}
                {permissions?.canViewAllReports && (
                  <DropdownMenuItem 
                    onClick={() => navigate("/reports")}
                    className="hover:bg-gray-100 cursor-pointer text-gray-800"
                  >
                    Rapports
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user && (
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
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <User className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-2 border-gray-200 shadow-lg">
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-gray-100 cursor-pointer text-gray-800"
                >
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-primary-foreground/10"
              onClick={() => navigate("/login")}
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;