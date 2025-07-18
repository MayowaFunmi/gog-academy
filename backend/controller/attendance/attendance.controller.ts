import { AttendanceService } from "@/backend/service/attendance.service";
import { ApiResponse } from "@/backend/types/apiResponse";
import { NextRequest } from "next/server";

export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  async markAttendance(
    request: NextRequest,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const { taskId, taskDate } = body;
      if (!taskId || !taskDate) {
        return {
          status: "bad_request",
          message: "Both task ID and task date are required.",
        };
      }
      return await this.attendanceService.markAttendance(
        userId,
        taskId,
        taskDate
      );
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }
}
