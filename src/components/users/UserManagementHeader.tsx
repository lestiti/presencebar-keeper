import UserActionButtons from "@/components/UserActionButtons";

interface UserManagementHeaderProps {
  showRegistrationForm: boolean;
  showBulkImport: boolean;
  showSynodeManager: boolean;
  onToggleRegistration: () => void;
  onToggleBulkImport: () => void;
  onToggleSynodeManager: () => void;
}

const UserManagementHeader = ({
  showRegistrationForm,
  showBulkImport,
  showSynodeManager,
  onToggleRegistration,
  onToggleBulkImport,
  onToggleSynodeManager,
}: UserManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-primary">Gestion des Utilisateurs</h1>
      <UserActionButtons 
        showRegistrationForm={showRegistrationForm}
        showBulkImport={showBulkImport}
        showSynodeManager={showSynodeManager}
        onToggleRegistration={onToggleRegistration}
        onToggleBulkImport={onToggleBulkImport}
        onToggleSynodeManager={onToggleSynodeManager}
      />
    </div>
  );
};

export default UserManagementHeader;