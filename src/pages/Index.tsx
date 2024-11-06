import Header from "@/components/Header";
import Scanner from "@/components/Scanner";
import AttendanceTable from "@/components/AttendanceTable";
import AttendanceStats from "@/components/statistics/AttendanceStats";
import { AttendanceRecord } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { ChevronUp, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
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

  const attendances: AttendanceRecord[] = [
    {
      id: 1,
      userId: 1,
      name: "Jean Dupont",
      timestamp: new Date("2024-03-20T08:30:00"),
      type: "entry",
      synode: "Synode A",
    },
    {
      id: 2,
      userId: 1,
      name: "Jean Dupont",
      timestamp: new Date("2024-03-20T10:15:00"),
      type: "final_exit",
      synode: "Synode A",
      duration: "1h45min",
    },
    {
      id: 3,
      userId: 2,
      name: "Marie Martin", 
      timestamp: new Date("2024-03-20T09:00:00"),
      type: "entry",
      synode: "Synode B",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Scanner />
        </div>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Statistiques</h2>
          <AttendanceStats attendances={attendances} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-6">Présences du Jour</h2>
          <AttendanceTable />
        </section>
      </main>

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
    </div>
  );
};

export default Index;
