import { supabase } from "@/integrations/supabase/client";

export const createOrGetUser = async (firstName: string, lastName: string) => {
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  try {
    // First, try to sign in the user in case they already exist
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'defaultPassword123',
    });

    // If sign in succeeds, return the existing user's ID
    if (signInData.user) {
      return signInData.user.id;
    }

    // If user doesn't exist, create a new one
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: 'defaultPassword123',
    });

    if (signUpError) {
      throw signUpError;
    }

    if (!signUpData.user) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    return signUpData.user.id;
  } catch (error: any) {
    throw new Error(error.message || "Erreur lors de la création de l'utilisateur");
  }
};