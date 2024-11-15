import { supabase } from "@/integrations/supabase/client";

export const createOrGetUser = async (firstName: string, lastName: string) => {
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  try {
    // First try to get the user from auth
    const { data: existingAuthUser } = await supabase.auth.admin.getUserByEmail(email);

    if (existingAuthUser?.user) {
      return existingAuthUser.user.id;
    }

    // If no existing auth user, create a new one
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password: 'defaultPassword123', // You might want to generate this randomly
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        // If user exists but we couldn't get them earlier, try to sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'defaultPassword123',
        });

        if (signInError) throw signInError;
        if (!signInData.user) throw new Error("Impossible de récupérer l'utilisateur");
        
        return signInData.user.id;
      }
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