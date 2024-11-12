import UserRegistrationForm from "@/components/UserRegistrationForm";
import type { Synode } from "@/types/synode";

interface UserRegistrationSectionProps {
  show: boolean;
  synodes: Synode[];
  onSubmit: (formData: {
    name: string;
    phone: string;
    function: string;
    synode: string;
  }) => void;
}

const UserRegistrationSection = ({ show, synodes, onSubmit }: UserRegistrationSectionProps) => {
  if (!show) return null;

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Inscription d'un nouvel utilisateur</h2>
      <UserRegistrationForm onSubmit={onSubmit} synodes={synodes} />
    </div>
  );
};

export default UserRegistrationSection;