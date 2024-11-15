import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';

const AbsenceNotifier = () => {
  const { data: longAbsences } = useQuery({
    queryKey: ['long-absences'],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          attendances (
            timestamp
          )
        `)
        .order('last_name');

      if (error) throw error;

      return data?.filter(profile => {
        const lastAttendance = profile.attendances?.[0]?.timestamp;
        if (!lastAttendance) return true;
        return new Date(lastAttendance) < thirtyDaysAgo;
      }) || [];
    },
    refetchInterval: 24 * 60 * 60 * 1000, // Check once per day
  });

  useEffect(() => {
    if (longAbsences?.length) {
      toast({
        title: "Absences prolongées détectées",
        description: `${longAbsences.length} personne(s) n'ont pas été présentes depuis plus de 30 jours.`,
        duration: 10000,
      });
    }
  }, [longAbsences]);

  return null;
};

export default AbsenceNotifier;