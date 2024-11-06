import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface AttendanceForExport {
  profiles: {
    first_name: string;
    last_name: string;
    phone?: string;
    function?: string;
    synodes: {
      name: string;
      color: string;
    };
  };
  timestamp: string;
  type: string;
  duration?: string | null;
}

export const generateCSVContent = (attendances: AttendanceForExport[]) => {
  // En-têtes
  const headers = [
    "Nom",
    "Prénom",
    "Numéro de téléphone",
    "Fonction",
    "Synode",
    "Date",
    "Heure d'entrée",
    "Heure de sortie",
    "Statut de présence",
    "Durée totale"
  ];

  // Regrouper les entrées/sorties par utilisateur et date
  const attendancesByUserAndDate = attendances.reduce((acc, curr) => {
    const date = format(new Date(curr.timestamp), "yyyy-MM-dd");
    const userId = curr.profiles.id;
    const key = `${userId}-${date}`;
    
    if (!acc[key]) {
      acc[key] = {
        user: curr.profiles,
        date,
        entry: null,
        exit: null,
      };
    }

    if (curr.type === "entry") {
      acc[key].entry = curr;
    } else if (curr.type === "final_exit") {
      acc[key].exit = curr;
    }

    return acc;
  }, {} as Record<string, any>);

  // Convertir les données en lignes CSV
  const rows = Object.values(attendancesByUserAndDate).map((record: any) => {
    const entryTime = record.entry ? format(new Date(record.entry.timestamp), "HH:mm") : "-";
    const exitTime = record.exit ? format(new Date(record.exit.timestamp), "HH:mm") : "-";
    
    return [
      record.user.last_name,
      record.user.first_name,
      record.user.phone || "-",
      record.user.function || "-",
      record.user.synodes.name,
      format(new Date(record.date), "dd/MM/yyyy"),
      entryTime,
      exitTime,
      record.entry && record.exit ? "Présent" : "Absent",
      record.exit?.duration || "-"
    ];
  });

  // Ajouter une légende
  const legend = [
    "",
    "Légende :",
    "Vert : Entrée à l'heure",
    "Orange : Retard",
    "Bleu : Sortie régulière",
    "Rouge : Sortie anticipée",
    "",
    "Codes couleurs des synodes :",
    "Synode A : #7facd6",
    "Synode B : #bfb8da",
    "Synode C : #e8b7d4",
    "Synode D : #a5678e"
  ];

  return [
    headers.join(","),
    ...rows.map(row => row.join(",")),
    ...legend
  ].join("\n");
};