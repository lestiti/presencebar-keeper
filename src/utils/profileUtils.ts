import { supabase } from "@/integrations/supabase/client";

export const checkExistingProfile = async (firstName: string, lastName: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('first_name', firstName)
      .eq('last_name', lastName)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error: any) {
    throw new Error(`Erreur lors de la vérification du profil: ${error.message}`);
  }
};

export const createUserProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  userFunction: string,
  synodeId: string,
  phone: string
) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        first_name: firstName,
        last_name: lastName,
        function: userFunction,
        synode_id: synodeId,
        phone: phone,
        role: 'synode_manager'
      });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    throw new Error(`Erreur lors de la création du profil: ${error.message}`);
  }
};