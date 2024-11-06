export type AttendanceType = "entry" | "temporary_exit" | "final_exit";

export interface AttendanceRecord {
  id: number;
  userId: number;
  timestamp: Date;
  type: AttendanceType;
  name: string;
  synode: string;
}