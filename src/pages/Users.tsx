import { useState } from "react";
import UserRegistrationForm from "@/components/UserRegistrationForm";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import BulkUserImport from "@/components/BulkUserImport";
import SynodeManager from "@/components/SynodeManager";
import NavigationButtons from "@/components/NavigationButtons";
import { supabase } from "@/integrations/supabase/client";
import type { Synode } from "@/types/synode";
import { useQuery } from "@tanstack/react-query";
import UserList from "@/components/UserList";
import UserActionButtons from "@/components/UserActionButtons";
import { v4 as uuidv4 } from 'uuid';

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
    
    const userData = {
      id: uuidv4(),
      first_name: firstName,
      last_name: lastName || '',
      function: formData.function,
      synode_id: formData.synode,
      phone: formData.phone,
      role: 'synode_manager' as const
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
    const usersToInsert = users.map(user => {
      const [firstName, lastName] = user.name.split(' ');
      return {
        id: uuidv4(),
        first_name: firstName,
        last_name: lastName || '',
        function: user.function,
        synode_id: user.synode,
        phone: user.phone,
        role: 'synode_manager' as const
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

  const toggleForms = (form: 'registration' | 'bulk' | 'synode') => {
    setShowRegistrationForm(form === 'registration' ? !showRegistrationForm : false);
    setShowBulkImport(form === 'bulk' ? !showBulkImport : false);
    setShowSynodeManager(form === 'synode' ? !showSynodeManager : false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Gestion des Utilisateurs</h1>
          <UserActionButtons 
            showRegistrationForm={showRegistrationForm}
            showBulkImport={showBulkImport}
            showSynodeManager={showSynodeManager}
            onToggleRegistration={() => toggleForms('registration')}
            onToggleBulkImport={() => toggleForms('bulk')}
            onToggleSynodeManager={() => toggleForms('synode')}
          />
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

        <UserList users={users} synodes={synodes} />
      </main>
      <NavigationButtons />
    </div>
  );
};

export default Users;