import { useState } from "react";
import UserRegistrationForm from "@/components/UserRegistrationForm";
import UserCard from "@/components/UserCard";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BulkUserImport from "@/components/BulkUserImport";
import SynodeManager from "@/components/SynodeManager";
import NavigationButtons from "@/components/NavigationButtons";
import { supabase } from "@/integrations/supabase/client";
import type { Synode } from "@/types/synode";
import { useQuery } from "@tanstack/react-query";
import type { ProfileInsert } from "@/types/profile";

interface UserFormData {
  name: string;
  phone: string;
  function: string;
  synode: string;
}

const Users = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showSynodeManager, setShowSynodeManager] = useState(false);

  const { data: users = [], refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
        });
        throw error;
      }
      
      return data || [];
    },
  });

  const { data: synodes = [] } = useQuery({
    queryKey: ['synodes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('synodes')
        .select('*');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les synodes",
        });
        throw error;
      }
      
      return data || [];
    },
  });

  const handleUserRegistration = async (formData: UserFormData) => {
    const [firstName, lastName] = formData.name.split(' ');
    
    const userData: ProfileInsert = {
      first_name: firstName,
      last_name: lastName || '',
      function: formData.function,
      synode_id: formData.synode,
      phone: formData.phone,
      role: 'synode_manager'
    };

    const { error } = await supabase
      .from('profiles')
      .insert([userData]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer l'utilisateur",
      });
      return;
    }

    refetchUsers();
    setShowRegistrationForm(false);
    toast({
      title: "Utilisateur enregistré",
      description: "L'utilisateur a été ajouté avec succès",
    });
  };

  const handleBulkImport = async (users: UserFormData[]) => {
    const usersToInsert: ProfileInsert[] = users.map(user => {
      const [firstName, lastName] = user.name.split(' ');
      return {
        first_name: firstName,
        last_name: lastName || '',
        function: user.function,
        synode_id: user.synode,
        phone: user.phone,
        role: 'synode_manager'
      };
    });

    const { error } = await supabase
      .from('profiles')
      .insert(usersToInsert);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'importer les utilisateurs",
      });
      return;
    }

    refetchUsers();
    setShowBulkImport(false);
    toast({
      title: "Importation réussie",
      description: `${users.length} utilisateur(s) importé(s) avec succès`,
    });
  };

  const handleSynodeCreate = async (synodeData: Omit<Synode, "id">) => {
    const { error } = await supabase
      .from('synodes')
      .insert([synodeData]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le synode",
      });
      return;
    }

    setShowSynodeManager(false);
  };

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
              setShowSynodeManager(false);
            }}>
              {showRegistrationForm ? "Annuler" : "Nouvel Utilisateur"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setShowBulkImport(!showBulkImport);
                setShowRegistrationForm(false);
                setShowSynodeManager(false);
              }}
            >
              {showBulkImport ? "Annuler" : "Importation en masse"}
            </Button>
            <Button 
              variant="secondary"
              onClick={() => {
                setShowSynodeManager(!showSynodeManager);
                setShowRegistrationForm(false);
                setShowBulkImport(false);
              }}
            >
              {showSynodeManager ? "Annuler" : "Gérer les Synodes"}
            </Button>
          </div>
        </div>

        {showRegistrationForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Inscription d'un nouvel utilisateur</h2>
            <UserRegistrationForm onSubmit={handleUserRegistration} synodes={synodes} />
          </div>
        )}

        {showBulkImport && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Importation en masse des utilisateurs</h2>
            <BulkUserImport onImport={handleBulkImport} />
          </div>
        )}

        {showSynodeManager && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Gestion des Synodes</h2>
            <SynodeManager onSynodeCreate={handleSynodeCreate} />
          </div>
        )}

        {synodes.map(synode => (
          <div key={synode.id} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: synode.color }}
              />
              <h2 className="text-2xl font-semibold">{synode.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users
                .filter(user => user.synode_id === synode.id)
                .map(user => (
                  <UserCard 
                    key={user.id} 
                    user={{
                      id: parseInt(user.id),
                      name: `${user.first_name} ${user.last_name}`,
                      function: user.function || '',
                      synode: synode.color,
                      phone: user.phone || '',
                    }} 
                  />
                ))
              }
            </div>
          </div>
        ))}
      </main>
      <NavigationButtons />
    </div>
  );
};

export default Users;
