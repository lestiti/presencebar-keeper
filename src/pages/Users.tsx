import Header from "@/components/Header";
import NavigationButtons from "@/components/NavigationButtons";
import UserList from "@/components/UserList";
import UserManagementHeader from "@/components/users/UserManagementHeader";
import UserRegistrationSection from "@/components/users/UserRegistrationSection";
import BulkImportSection from "@/components/users/BulkImportSection";
import { useUserManagement } from "@/hooks/useUserManagement";

const Users = () => {
  const {
    users,
    synodes,
    showRegistrationForm,
    showBulkImport,
    handleUserRegistration,
    handleBulkImport,
    toggleForms,
  } = useUserManagement();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <UserManagementHeader 
          showRegistrationForm={showRegistrationForm}
          showBulkImport={showBulkImport}
          showSynodeManager={false}
          onToggleRegistration={() => toggleForms('registration')}
          onToggleBulkImport={() => toggleForms('bulk')}
          onToggleSynodeManager={() => {}}
        />

        <UserRegistrationSection
          show={showRegistrationForm}
          synodes={synodes}
          onSubmit={handleUserRegistration}
        />

        <BulkImportSection
          show={showBulkImport}
          onImport={handleBulkImport}
        />

        <UserList users={users} synodes={synodes} />
      </main>
      <NavigationButtons />
    </div>
  );
};

export default Users;