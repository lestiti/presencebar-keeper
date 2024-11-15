import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const SessionMonitor = () => {
  useEffect(() => {
    const updateLastActivity = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          // First check if we have any synodes
          const { data: synodes, error: synodesError } = await supabase
            .from('synodes')
            .select('id')
            .limit(1);

          if (synodesError) throw synodesError;

          // If no synodes exist, create a default one
          let synode_id;
          if (!synodes || synodes.length === 0) {
            const { data: newSynode, error: createSynodeError } = await supabase
              .from('synodes')
              .insert({
                name: 'Default Synode',
                color: '#33539E'
              })
              .select('id')
              .single();

            if (createSynodeError) throw createSynodeError;
            synode_id = newSynode.id;
          } else {
            synode_id = synodes[0].id;
          }

          // Check if profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) throw profileError;

          // If no profile exists, create one
          if (!profile) {
            const { error: createProfileError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                first_name: session.user.user_metadata.first_name || 'Unknown',
                last_name: session.user.user_metadata.last_name || 'User',
                synode_id: synode_id
              });

            if (createProfileError) throw createProfileError;
          }

          // Update user session
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
        } catch (error: any) {
          console.error('Error in session monitor:', error);
          toast({
            title: "Erreur de session",
            description: "Une erreur est survenue lors de la mise à jour de la session",
            variant: "destructive",
          });
        }
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