export type AttendanceType = "entry" | "final_exit";

export interface AttendanceRecord {
  id: number;
  userId: number;
  timestamp: Date;
  type: AttendanceType;
  name: string;
  synode: string;
  duration?: string; // Durée depuis la dernière action (pour les sorties)
}