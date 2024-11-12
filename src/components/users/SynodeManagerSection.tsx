import SynodeManager from "@/components/SynodeManager";
import type { Synode } from "@/types/synode";

interface SynodeManagerSectionProps {
  show: boolean;
  onSynodeCreate: (synode: Omit<Synode, "id">) => void;
}

const SynodeManagerSection = ({ show, onSynodeCreate }: SynodeManagerSectionProps) => {
  if (!show) return null;

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Gestion des Synodes</h2>
      <SynodeManager onSynodeCreate={onSynodeCreate} />
    </div>
  );
};

export default SynodeManagerSection;