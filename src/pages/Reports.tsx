import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomReport from "@/components/reports/CustomReport";
import DailyReport from "@/components/reports/DailyReport";
import WeeklyReport from "@/components/reports/WeeklyReport";
import Header from "@/components/Header";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { useRolePermissions } from "@/hooks/useRolePermissions";

const Reports = () => {
  const { permissions } = useRolePermissions();

  if (!permissions?.canViewAllReports && !permissions?.canViewSynodeReports) {
    return <div>Accès non autorisé</div>;
  }

  return (
    <RoleProtectedRoute requiredPermission="canViewSynodeReports">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-8 px-4">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Rapports de Présence</h1>
              <p className="text-gray-600">
                Consultez et analysez les données de présence
              </p>
            </div>

            <Tabs defaultValue="custom" className="space-y-4">
              <TabsList>
                <TabsTrigger value="custom">Rapport Personnalisé</TabsTrigger>
                <TabsTrigger value="daily">Rapport Journalier</TabsTrigger>
                <TabsTrigger value="weekly">Rapport Hebdomadaire</TabsTrigger>
              </TabsList>

              <TabsContent value="custom">
                <CustomReport />
              </TabsContent>

              <TabsContent value="daily">
                <DailyReport />
              </TabsContent>

              <TabsContent value="weekly">
                <WeeklyReport />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </RoleProtectedRoute>
  );
};

export default Reports;