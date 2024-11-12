import BulkUserImport from "@/components/BulkUserImport";

interface BulkImportSectionProps {
  show: boolean;
  onImport: (users: any[]) => void;
}

const BulkImportSection = ({ show, onImport }: BulkImportSectionProps) => {
  if (!show) return null;

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Importation en masse des utilisateurs</h2>
      <BulkUserImport onImport={onImport} />
    </div>
  );
};

export default BulkImportSection;