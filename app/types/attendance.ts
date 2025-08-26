export interface Attendance {
  id: string
  userId: string
  taskId: string
  date: string
  attendedAt: string
  marked: boolean
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