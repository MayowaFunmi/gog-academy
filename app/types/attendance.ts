export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT"
}

export interface Attendance {
  id: string
  userId: string
  taskId: string
  date: string
  attendedAt: string
  status: AttendanceStatus
  // marked: boolean
  isLate: boolean
  score: number
}

export interface AttendanceResponse {
  status: string
  message: string
  data: Attendance
}

export interface AttendanceFormData {
  taskId: string
  taskDate: string
}