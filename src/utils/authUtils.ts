import { supabase } from "@/integrations/supabase/client";

export const createOrGetUser = async (firstName: string, lastName: string) => {
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  try {
    // First try to get user by email using data query
    const { data: existingUsers } = await supabase
      .from('profiles')
      .select('id')
      .eq('first_name', firstName)
      .eq('last_name', lastName)
      .single();

    if (existingUsers) {
      return existingUsers.id;
    }

    // If no existing user, create a new one
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password: 'defaultPassword123', // You might want to generate this randomly
    });

    if (signUpError) {
      throw new Error(`Erreur lors de la création: ${signUpError.message}`);
    }

    if (!newUser.user) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    return newUser.user.id;
  } catch (error: any) {
    throw new Error(error.message || "Erreur lors de la création de l'utilisateur");
  }
};