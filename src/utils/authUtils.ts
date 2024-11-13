import { supabase } from "@/integrations/supabase/client";

export const createOrGetUser = async (firstName: string, lastName: string) => {
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  try {
    // Check if user exists first
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail(email);
    
    if (existingUser?.user) {
      return existingUser.user.id;
    }

    // If user doesn't exist, create a new one
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: 'defaultPassword123',
    });

    if (signUpError) {
      throw new Error(`Erreur lors de la création: ${signUpError.message}`);
    }

    if (!signUpData.user) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    return signUpData.user.id;
  } catch (error: any) {
    throw new Error(error.message || "Erreur lors de la création de l'utilisateur");
  }
};