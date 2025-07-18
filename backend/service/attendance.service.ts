import { isSameDay, isBefore, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "../types/apiResponse";

export class AttendanceService {
  constructor() {}

  async markAttendance(
    userId: string,
    taskId: string,
    date: string
  ): Promise<ApiResponse> {
    try {
      const sentDate = new Date(date);
      const today = new Date();
      const isToday = isSameDay(sentDate, today);
      const isBeforeToday = isBefore(startOfDay(sentDate), today);

      if (isBeforeToday) {
        return {
          status: "bad_request",
          message: "Attendance cannot be marked before task starts.",
        };
      }

      const existing = await prisma.attendance.findUnique({
        where: {
          userId_taskId_date: { userId, taskId, date: startOfDay(today) },
        },
      });

      if (existing) {
        return {
          status: "conflict",
          message: "Attendance already marked for this task.",
        };
      }

      const attendance = await prisma.$transaction(async (tx) => {
        const newAttendance = await tx.attendance.create({
          data: {
            userId,
            taskId,
            date: today,
            marked: isToday,
            isLate: !isToday,
          },
        });
        return newAttendance;
      });
      return {
        status: "success",
        message: "Attendance marked successfully.",
        data: attendance,
      };
    } catch (error) {
      console.error("Error logging out user:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  async getAttendanceForTask(taskId: string): Promise<ApiResponse> {
    try {
      const records = await prisma.attendance.findMany({
        where: { taskId },
        include: { user: true },
        orderBy: { attendedAt: "asc" },
      });
      return {
        status: "success",
        message: "Attendance records fetched.",
        data: records,
      };
    } catch (error) {
      console.error("Error logging out user:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}
