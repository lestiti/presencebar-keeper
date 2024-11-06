import { useState } from "react";
import UserRegistrationForm from "@/components/UserRegistrationForm";
import UserCard from "@/components/UserCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BulkUserImport from "@/components/BulkUserImport";

interface User {
  id: number;
  name: string;
  function: string;
  synode: string;
  phone: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);

  const handleUserRegistration = (userData: Omit<User, "id">) => {
    const newUser: User = {
      ...userData,
      id: users.length + 1,
    };

    setUsers([...users, newUser]);
    setShowRegistrationForm(false);
    toast({
      title: "Utilisateur enregistré",
      description: "L'utilisateur a été ajouté avec succès",
    });
  };

  const handleBulkImport = (importedUsers: Omit<User, "id">[]) => {
    const newUsers = importedUsers.map((user, index) => ({
      ...user,
      id: users.length + index + 1,
    }));

    setUsers([...users, ...newUsers]);
    setShowBulkImport(false);
  };

  const synodes = [...new Set(users.map(user => user.synode))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestion des Utilisateurs</h1>
          <div className="flex gap-4">
            <Button onClick={() => {
              setShowRegistrationForm(!showRegistrationForm);
              setShowBulkImport(false);
            }}>
              {showRegistrationForm ? "Annuler" : "Nouvel Utilisateur"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowBulkImport(!showBulkImport);
                setShowRegistrationForm(false);
              }}
            >
              {showBulkImport ? "Annuler" : "Importation en masse"}
            </Button>
          </div>
        </div>

        {showRegistrationForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Inscription d'un nouvel utilisateur</h2>
            <UserRegistrationForm onSubmit={handleUserRegistration} />
          </div>
        )}

        {showBulkImport && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Importation en masse des utilisateurs</h2>
            <BulkUserImport onImport={handleBulkImport} />
          </div>
        )}

        {synodes.map(synode => (
          <div key={synode} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{synode}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users
                .filter(user => user.synode === synode)
                .map(user => (
                  <UserCard key={user.id} user={user} />
                ))
              }
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Users;