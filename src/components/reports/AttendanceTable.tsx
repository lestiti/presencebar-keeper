import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Attendance {
  id: string;
  type: string;
  timestamp: string;
  duration: unknown | null;
  user_id: string;
  notes: string | null;
  profiles: {
    first_name: string;
    last_name: string;
    synodes: {
      name: string;
      color: string;
    }[];
  };
}

interface AttendanceTableProps {
  attendances: Attendance[];
}

const AttendanceTable = ({ attendances }: AttendanceTableProps) => {
  const getStatusBadge = (type: string) => {
    switch (type) {
      case "entry":
        return <Badge className="bg-green-500">Entrée</Badge>;
      case "temporary_exit":
        return <Badge className="bg-yellow-500">Sortie Temporaire</Badge>;
      case "temporary_entry":
        return <Badge className="bg-blue-500">Retour</Badge>;
      case "final_exit":
        return <Badge className="bg-red-500">Sortie</Badge>;
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
            <TableHead>Heure</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Durée</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell className="font-medium">
                {attendance.profiles.first_name} {attendance.profiles.last_name}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: attendance.profiles.synodes[0]?.color }}
                  />
                  {attendance.profiles.synodes[0]?.name}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(attendance.timestamp), "HH:mm", { locale: fr })}
              </TableCell>
              <TableCell>{getStatusBadge(attendance.type)}</TableCell>
              <TableCell>{attendance.duration?.toString() || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;