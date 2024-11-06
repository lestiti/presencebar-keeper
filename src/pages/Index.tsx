import Header from "@/components/Header";
import Scanner from "@/components/Scanner";
import AttendanceTable from "@/components/AttendanceTable";
import UserCard from "@/components/UserCard";

const Index = () => {
  // Example user for demonstration
  const exampleUser = {
    id: 1,
    name: "Jean Dupont",
    function: "Mpiomana",
    synode: "Synode A",
    phone: "+261 34 00 000 00",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Scanner />
          <UserCard user={exampleUser} />
        </div>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-primary mb-6">Présences du Jour</h2>
          <AttendanceTable />
        </section>
      </main>
    </div>
  );
};

export default Index;