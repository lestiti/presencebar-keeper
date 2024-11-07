import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ACCESS_CODE = "Tsiurrvk3131*";

const AccessCodePrompt = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      localStorage.setItem("userAccessGranted", "true");
      navigate("/users");
      toast.success("Accès autorisé");
    } else {
      toast.error("Code d'accès incorrect");
      setCode("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Accès Restreint
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Code d'accès
            </label>
            <Input
              id="code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Entrez le code d'accès"
              className="w-full"
              autoComplete="off"
            />
          </div>
          <Button type="submit" className="w-full">
            Accéder
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccessCodePrompt;