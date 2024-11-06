import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AttendanceRecord, AttendanceType } from "@/types/attendance";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const AttendanceTable = () => {
  // Example data - in real app this would come from props or API
  const attendances: AttendanceRecord[] = [
    {
      id: 1,
      userId: 1,
      name: "Jean Dupont",
      timestamp: new Date("2024-03-20T08:30:00"),
      type: "entry",
      synode: "Synode A",
    },
    {
      id: 2,
      userId: 1,
      name: "Jean Dupont",
      timestamp: new Date("2024-03-20T10:15:00"),
      type: "final_exit",
      synode: "Synode A",
      duration: "1h45min",
    },
    {
      id: 3,
      userId: 1,
      name: "Jean Dupont",
      timestamp: new Date("2024-03-20T10:45:00"),
      type: "entry",
      synode: "Synode A",
    },
  ];

  const getStatusBadge = (type: AttendanceType) => {
    switch (type) {
      case "entry":
        return <Badge className="bg-green-500">Entrée</Badge>;
      case "final_exit":
        return <Badge className="bg-red-500">Sortie</Badge>;
      default:
        return null;
    }
  };

  const handleExport = () => {
    // Créer le contenu CSV
    const headers = ["Nom", "Synode", "Date/Heure", "Type", "Durée"];
    const rows = attendances.map(attendance => [
      attendance.name,
      attendance.synode,
      attendance.timestamp.toLocaleString(),
      attendance.type === "entry" ? "Entrée" : "Sortie",
      attendance.duration || "-"
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `presences_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Synode</TableHead>
              <TableHead>Date/Heure</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Durée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell className="font-medium">{attendance.name}</TableCell>
                <TableCell>{attendance.synode}</TableCell>
                <TableCell>
                  {attendance.timestamp.toLocaleString()}
                </TableCell>
                <TableCell>
                  {getStatusBadge(attendance.type)}
                </TableCell>
                <TableCell>
                  {attendance.duration || "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceTable;