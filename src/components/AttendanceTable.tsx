import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Attendance {
  id: number;
  name: string;
  timeIn: string;
  timeOut: string | null;
  synode: string;
}

const AttendanceTable = () => {
  // Example data - in real app this would come from props or API
  const attendances: Attendance[] = [
    {
      id: 1,
      name: "Jean Dupont",
      timeIn: "08:30",
      timeOut: "17:00",
      synode: "Synode A",
    },
    {
      id: 2,
      name: "Marie Martin",
      timeIn: "09:00",
      timeOut: null,
      synode: "Synode B",
    },
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Synode</TableHead>
            <TableHead>Entrée</TableHead>
            <TableHead>Sortie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((attendance) => (
            <TableRow key={attendance.id}>
              <TableCell className="font-medium">{attendance.name}</TableCell>
              <TableCell>{attendance.synode}</TableCell>
              <TableCell>{attendance.timeIn}</TableCell>
              <TableCell>
                {attendance.timeOut || "En cours"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;