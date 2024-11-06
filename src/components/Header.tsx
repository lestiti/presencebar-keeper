import { Bell, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
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
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <User className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;