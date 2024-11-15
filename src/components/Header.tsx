import { FileText, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-white p-4 shadow-lg">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button 
              variant="ghost" 
              className="text-white flex items-center gap-2"
              onClick={() => navigate("/users")}
            >
              <Users className="h-5 w-5" />
              <span>Utilisateurs</span>
            </Button>
            <Button
              variant="ghost"
              className="text-white flex items-center gap-2"
              onClick={() => navigate("/reports")}
            >
              <FileText className="h-5 w-5" />
              <span>Rapports</span>
            </Button>
            <Button
              variant="ghost"
              className="text-white flex items-center gap-2"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
              <span>Paramètres</span>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;