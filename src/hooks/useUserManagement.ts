import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { createOrGetUser } from "@/utils/authUtils";
import { checkExistingProfile, createUserProfile } from "@/utils/profileUtils";

export const useUserManagement = () => {
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
    try {
      const [firstName, lastName] = formData.name.split(' ');
      
      if (!firstName || !lastName) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Le nom doit contenir un prénom et un nom",
        });
        return;
      }

      // Check if profile exists
      const existingProfile = await checkExistingProfile(firstName, lastName);

      if (existingProfile) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Un utilisateur avec ce nom existe déjà",
        });
        return;
      }

      // Create or get auth user
      const userId = await createOrGetUser(firstName, lastName);

      // Create profile
      await createUserProfile(
        userId,
        firstName,
        lastName,
        formData.function,
        formData.synode,
        formData.phone
      );

      await refetchUsers();
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
        
        if (!firstName || !lastName) {
          throw new Error(`Format de nom invalide pour: ${user.name}`);
        }

        const userId = await createOrGetUser(firstName, lastName);
        await createUserProfile(
          userId,
          firstName,
          lastName,
          user.function,
          user.synode,
          user.phone
        );
      }

      await refetchUsers();
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
      const { error } = await supabase
        .from('synodes')
        .insert(synodeData);

      if (error) throw error;

      await refetchSynodes();
      setShowSynodeManager(false);
      
      toast({
        title: "Synode créé",
        description: "Le synode a été créé avec succès",
      });
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