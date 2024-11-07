import { FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("userAccessGranted") === "true";

  const handleUsersClick = () => {
    if (!isAuthenticated) {
      localStorage.removeItem("userAccessGranted");
      navigate("/access-code", { state: { from: location } });
    } else {
      navigate("/users");
    }
  };

  return (
    <header className="bg-primary text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Gestion de Présence</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-white flex items-center gap-2"
            onClick={handleUsersClick}
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
        </div>
      </div>
    </header>
  );
};

export default Header;