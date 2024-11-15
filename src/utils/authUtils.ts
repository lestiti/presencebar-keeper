import { supabase } from "@/integrations/supabase/client";

export const createOrGetUser = async (firstName: string, lastName: string) => {
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  try {
    // Try to sign in with the default password first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'defaultPassword123',
    });

    // If sign in successful, user exists
    if (!signInError && signInData.user) {
      return signInData.user.id;
    }

    // If user doesn't exist or other error, try to create new user
    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email,
      password: 'defaultPassword123', // You might want to generate this randomly
    });

    if (signUpError) {
      if (signUpError.message.includes('User already registered')) {
        // If somehow we got here with an existing user, try to sign in again
        const { data: retrySignInData, error: retrySignInError } = await supabase.auth.signInWithPassword({
          email,
          password: 'defaultPassword123',
        });

        if (retrySignInError) throw retrySignInError;
        if (!retrySignInData.user) throw new Error("Impossible de récupérer l'utilisateur");
        
        return retrySignInData.user.id;
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