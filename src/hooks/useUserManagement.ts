import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useUserManagement = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [showSynodeManager, setShowSynodeManager] = useState(false);
  const queryClient = useQueryClient();

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

  const { data: synodes = [], refetch: refetchSynodes } = useQuery({
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

  const handleUserRegistration = async (formData: {
    name: string;
    phone: string;
    function: string;
    synode: string;
  }) => {
    const [firstName, lastName] = formData.name.split(' ');
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        password: 'defaultPassword123',
      });

      if (authError || !authData.user) {
        throw authError || new Error('Failed to create auth user');
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          function: formData.function,
          synode_id: formData.synode,
          phone: formData.phone,
          role: 'synode_manager'
        }]);

      if (profileError) {
        throw profileError;
      }

      refetchUsers();
      setShowRegistrationForm(false);
      toast({
        title: "Utilisateur enregistré",
        description: "L'utilisateur a été ajouté avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer l'utilisateur",
      });
    }
  };

  const handleBulkImport = async (users: any[]) => {
    try {
      for (const user of users) {
        const [firstName, lastName] = user.name.split(' ');
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
          password: 'defaultPassword123',
        });

        if (authError || !authData.user) {
          throw authError || new Error('Failed to create auth user');
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            function: user.function,
            synode_id: user.synode,
            phone: user.phone,
            role: 'synode_manager'
          }]);

        if (profileError) {
          throw profileError;
        }
      }

      refetchUsers();
      setShowBulkImport(false);
      toast({
        title: "Importation réussie",
        description: `${users.length} utilisateur(s) importé(s) avec succès`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible d'importer les utilisateurs",
      });
    }
  };

  const handleSynodeCreate = async (synodeData: { name: string; color: string; }) => {
    try {
      await refetchSynodes();
      setShowSynodeManager(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Impossible de créer le synode",
      });
    }
  };

  const toggleForms = (form: 'registration' | 'bulk' | 'synode') => {
    setShowRegistrationForm(form === 'registration' ? !showRegistrationForm : false);
    setShowBulkImport(form === 'bulk' ? !showBulkImport : false);
    setShowSynodeManager(form === 'synode' ? !showSynodeManager : false);
  };

  return {
    users,
    synodes,
    showRegistrationForm,
    showBulkImport,
    showSynodeManager,
    handleUserRegistration,
    handleBulkImport,
    handleSynodeCreate,
    toggleForms,
  };
};