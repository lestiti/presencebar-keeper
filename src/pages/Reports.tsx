import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomReport from "@/components/reports/CustomReport";
import DailyReport from "@/components/reports/DailyReport";
import WeeklyReport from "@/components/reports/WeeklyReport";
import FunctionReport from "@/components/reports/FunctionReport";
import AdvancedFilters from "@/components/reports/AdvancedFilters";
import Header from "@/components/Header";

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState({});

  return (
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

          <AdvancedFilters onFilterChange={setFilters} />

          <Tabs defaultValue="custom" className="space-y-4">
            <TabsList>
              <TabsTrigger value="custom">Rapport Personnalisé</TabsTrigger>
              <TabsTrigger value="daily">Rapport Journalier</TabsTrigger>
              <TabsTrigger value="weekly">Rapport Hebdomadaire</TabsTrigger>
              <TabsTrigger value="function">Rapport par Fonction</TabsTrigger>
            </TabsList>

            <TabsContent value="custom">
              <CustomReport filters={filters} />
            </TabsContent>

            <TabsContent value="daily">
              <DailyReport 
                date={selectedDate}
                onDateChange={setSelectedDate}
                filters={filters}
              />
            </TabsContent>

            <TabsContent value="weekly">
              <WeeklyReport 
                date={selectedDate}
                onDateChange={setSelectedDate}
                filters={filters}
              />
            </TabsContent>

            <TabsContent value="function">
              <FunctionReport filters={filters} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reports;