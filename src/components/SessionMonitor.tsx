import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SessionMonitor = () => {
  useEffect(() => {
    const updateLastActivity = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // First check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .single();

        // If no profile exists, create one
        if (!profile) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              first_name: session.user.user_metadata.first_name || 'Unknown',
              last_name: session.user.user_metadata.last_name || 'User',
              synode_id: (await supabase.from('synodes').select('id').limit(1).single()).data?.id
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
            return;
          }
        }

        // Now update the user session
        await supabase
          .from('user_sessions')
          .upsert({
            user_id: session.user.id,
            last_activity: new Date().toISOString(),
            device_info: {
              userAgent: navigator.userAgent,
              platform: navigator.platform
            }
          });
      }
    };

    const interval = setInterval(updateLastActivity, 5 * 60 * 1000); // Every 5 minutes
    updateLastActivity();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null;
};

export default SessionMonitor;