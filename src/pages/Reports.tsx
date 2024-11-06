import { useState } from "react";
import Header from "@/components/Header";
import DailyReport from "@/components/reports/DailyReport";
import WeeklyReport from "@/components/reports/WeeklyReport";
import CustomReport from "@/components/reports/CustomReport";
import NavigationButtons from "@/components/NavigationButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Rapports de Présence</h1>
        
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Rapport Quotidien</TabsTrigger>
            <TabsTrigger value="weekly">Rapport Hebdomadaire</TabsTrigger>
            <TabsTrigger value="custom">Rapport Personnalisé</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <DailyReport date={selectedDate} onDateChange={setSelectedDate} />
          </TabsContent>
          <TabsContent value="weekly">
            <WeeklyReport date={selectedDate} onDateChange={setSelectedDate} />
          </TabsContent>
          <TabsContent value="custom">
            <CustomReport />
          </TabsContent>
        </Tabs>
      </main>
      <NavigationButtons />
    </div>
  );
};

export default Reports;