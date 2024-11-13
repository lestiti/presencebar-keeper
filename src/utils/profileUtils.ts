import { supabase } from "@/integrations/supabase/client";

export const checkExistingProfile = async (firstName: string, lastName: string) => {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('first_name', firstName)
    .eq('last_name', lastName)
    .single();

  return data;
};

export const createUserProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  userFunction: string,
  synodeId: string,
  phone: string
) => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
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
};