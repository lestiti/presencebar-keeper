import { Button } from "@/components/ui/button";

interface UserActionButtonsProps {
  showRegistrationForm: boolean;
  showBulkImport: boolean;
  showSynodeManager: boolean;
  onToggleRegistration: () => void;
  onToggleBulkImport: () => void;
  onToggleSynodeManager: () => void;
}

const UserActionButtons = ({
  showRegistrationForm,
  showBulkImport,
  onToggleRegistration,
  onToggleBulkImport,
}: UserActionButtonsProps) => {
  return (
    <div className="flex gap-4">
      <Button onClick={onToggleRegistration}>
        {showRegistrationForm ? "Annuler" : "Nouvel Utilisateur"}
      </Button>
      <Button 
        variant="outline"
        onClick={onToggleBulkImport}
      >
        {showBulkImport ? "Annuler" : "Importation en masse"}
      </Button>
    </div>
  );
};

export default UserActionButtons;