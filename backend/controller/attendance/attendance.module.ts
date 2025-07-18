import { AttendanceService } from "@/backend/service/attendance.service";
import { AttendanceController } from "./attendance.controller";

export const attendanceController = new AttendanceController(new AttendanceService())