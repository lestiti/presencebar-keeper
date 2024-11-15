import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomReport from "@/components/reports/CustomReport";
import DailyReport from "@/components/reports/DailyReport";
import WeeklyReport from "@/components/reports/WeeklyReport";
import FunctionReport from "@/components/reports/FunctionReport";
import SynodeReport from "@/components/reports/SynodeReport";
import AdvancedFilters from "@/components/reports/AdvancedFilters";
import Header from "@/components/Header";
import NavigationButtons from "@/components/NavigationButtons";

export interface ReportFilters {
  synode?: string;
  function?: string;
  minDuration?: number;
  maxDuration?: number;
  searchTerm?: string;
}

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<ReportFilters>({});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationButtons />
      <main className="container mx-auto py-8 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Rapports de Présence</h1>
            <p className="text-gray-600">
              Consultez et analysez les données de présence
            </p>
          </div>

          <AdvancedFilters onFilterChange={setFilters} />

          <Tabs defaultValue="custom" className="space-y-4">
            <TabsList>
              <TabsTrigger value="custom">Rapport Personnalisé</TabsTrigger>
              <TabsTrigger value="daily">Rapport Journalier</TabsTrigger>
              <TabsTrigger value="weekly">Rapport Hebdomadaire</TabsTrigger>
              <TabsTrigger value="function">Rapport par Fonction</TabsTrigger>
              <TabsTrigger value="synode">Rapport par Synode</TabsTrigger>
            </TabsList>

            <TabsContent value="custom">
              <CustomReport filters={filters} />
            </TabsContent>

            <TabsContent value="daily">
              <DailyReport 
                date={selectedDate}
                onDateChange={setSelectedDate}
              />
            </TabsContent>

            <TabsContent value="weekly">
              <WeeklyReport 
                date={selectedDate}
                onDateChange={setSelectedDate}
              />
            </TabsContent>

            <TabsContent value="function">
              <FunctionReport />
            </TabsContent>

            <TabsContent value="synode">
              <SynodeReport />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reports;