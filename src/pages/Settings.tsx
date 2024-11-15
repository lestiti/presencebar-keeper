import Header from "@/components/Header";
import NavigationButtons from "@/components/NavigationButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SynodeSettings from "@/components/settings/SynodeSettings";

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Paramètres</h1>
            <p className="text-gray-600">
              Gérez les paramètres de l'application
            </p>
          </div>

          <Tabs defaultValue="synodes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="synodes">Gestion des Synodes</TabsTrigger>
            </TabsList>

            <TabsContent value="synodes">
              <SynodeSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <NavigationButtons />
    </div>
  );
};

export default Settings;