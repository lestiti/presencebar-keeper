import Header from "@/components/Header";
import MultipleScanner from "@/components/MultipleScanner";
import SessionMonitor from "@/components/SessionMonitor";
import AbsenceNotifier from "@/components/AbsenceNotifier";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SessionMonitor />
      <AbsenceNotifier />
      <Header />
      <main className="container mx-auto py-8 px-4">
        <MultipleScanner />
      </main>
    </div>
  );
};

export default Index;