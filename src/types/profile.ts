import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Omit<Profile, 'id' | 'created_at'>;