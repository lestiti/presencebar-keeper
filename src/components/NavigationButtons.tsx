import { ChevronUp, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const NavigationButtons = () => {
  const navigate = useNavigate();
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate('/')}
        className="bg-white shadow-lg hover:bg-gray-100"
      >
        <Home className="h-4 w-4" />
      </Button>

      {showScrollButton && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="bg-white shadow-lg hover:bg-gray-100"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;