import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const SessionMonitor = () => {
  const queryClient = useQueryClient();

  // Query for synodes with caching
  const { data: defaultSynode } = useQuery({
    queryKey: ['defaultSynode'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('synodes')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: newSynode, error: createError } = await supabase
          .from('synodes')
          .insert({
            name: 'Default Synode',
            color: '#33539E'
          })
          .select('id')
          .single();

        if (createError) throw createError;
        return newSynode;
      }

      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 3,
  });

  useEffect(() => {
    const updateLastActivity = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user || !defaultSynode) return;

      try {
        // Check if profile exists with efficient query
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        // Create profile if it doesn't exist
        if (!profile) {
          const { error: createProfileError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              first_name: session.user.user_metadata.first_name || 'Unknown',
              last_name: session.user.user_metadata.last_name || 'User',
              synode_id: defaultSynode.id
            });

          if (createProfileError) throw createProfileError;
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['profile'] });
        }

        // Update session with optimistic update
        const timestamp = new Date().toISOString();
        const deviceInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform
        };

        await supabase
          .from('user_sessions')
          .upsert({
            user_id: session.user.id,
            last_activity: timestamp,
            device_info: deviceInfo
          });

      } catch (error: any) {
        console.error('Error in session monitor:', error);
        toast({
          title: "Erreur de session",
          description: "Une erreur est survenue lors de la mise à jour de la session",
          variant: "destructive",
        });
      }
    };

    // Initial update
    updateLastActivity();

    // Set up interval with cleanup
    const interval = setInterval(updateLastActivity, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [defaultSynode, queryClient]);

  // Auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Clear queries on sign out
        queryClient.clear();
        toast({
          title: "Déconnexion",
          description: "Vous avez été déconnecté avec succès",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return null;
};

export default SessionMonitor;