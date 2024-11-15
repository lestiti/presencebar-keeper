import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import CreateSynodeForm from "./CreateSynodeForm";
import SynodeList from "./SynodeList";

const SynodeSettings = () => {
  const { data: synodes, refetch } = useQuery({
    queryKey: ["synodes-settings"],
    queryFn: async () => {
      const { data: synodesData, error: synodesError } = await supabase
        .from("synodes")
        .select(`
          id,
          name,
          color,
          profiles (
            id
          )
        `);

      if (synodesError) throw synodesError;
      return synodesData?.map(synode => ({
        ...synode,
        memberCount: synode.profiles?.length || 0
      }));
    },
  });

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Créer un nouveau synode</h2>
        <CreateSynodeForm onSynodeCreate={() => refetch()} />
      </Card>

      <SynodeList synodes={synodes || []} refetch={refetch} />
    </div>
  );
};

export default SynodeSettings;