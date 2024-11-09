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
  showSynodeManager,
  onToggleRegistration,
  onToggleBulkImport,
  onToggleSynodeManager,
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
      <Button 
        variant="secondary"
        onClick={onToggleSynodeManager}
      >
        {showSynodeManager ? "Annuler" : "Gérer les Synodes"}
      </Button>
    </div>
  );
};

export default UserActionButtons;