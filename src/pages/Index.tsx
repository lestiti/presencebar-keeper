import Header from "@/components/Header";
import Scanner from "@/components/Scanner";
import SessionMonitor from "@/components/SessionMonitor";
import AbsenceNotifier from "@/components/AbsenceNotifier";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SessionMonitor />
      <AbsenceNotifier />
      <Header />
      <main className="container mx-auto py-8 px-4">
        <Scanner scannerId={1} />
      </main>
    </div>
  );
};

export default Index;