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
      type: "temporary_exit",
      synode: "Synode A",
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
      case "temporary_exit":
        return <Badge className="bg-yellow-500">Sortie temporaire</Badge>;
      case "final_exit":
        return <Badge className="bg-red-500">Sortie définitive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Synode</TableHead>
            <TableHead>Date/Heure</TableHead>
            <TableHead>Type</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;