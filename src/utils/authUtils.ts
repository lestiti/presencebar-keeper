import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const createOrGetUser = async (firstName: string, lastName: string) => {
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  try {
    // Try to create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: 'defaultPassword123',
    });

    // If user exists in auth but not in profiles, we can still create the profile
    if (authError && !authError.message.includes('User already registered')) {
      throw authError;
    }

    // If we have a new user, return their ID
    if (authData?.user) {
      return authData.user.id;
    }

    // If user exists, we need to get their session
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: 'defaultPassword123',
    });

    if (signInError || !user) {
      throw new Error("Impossible de récupérer l'utilisateur");
    }

    return user.id;
  } catch (error: any) {
    throw error;
  }
};