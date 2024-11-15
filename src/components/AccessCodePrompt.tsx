import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AccessCodePrompt = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/users";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        sessionStorage.setItem('accessCodeValidated', 'true');
        
        toast({
          title: "Accès autorisé",
          description: "Vous pouvez maintenant accéder à l'application",
        });
        
        navigate(from, { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Code invalide",
          description: "Le code d'accès fourni n'est pas valide",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la vérification du code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Code d'accès requis
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Veuillez entrer votre code d'accès pour continuer
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-4">
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Entrez votre code d'accès"
              required
              className="block w-full rounded-md border-gray-300 shadow-sm"
              autoComplete="off"
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Vérification..." : "Valider"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessCodePrompt;