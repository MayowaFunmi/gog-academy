import { isBefore, startOfDay, isAfter } from "date-fns";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "../types/apiResponse";

export class AttendanceService {
  constructor() {}

  async markAttendance(
    userId: string,
    taskId: string,
    taskDate: string
  ): Promise<ApiResponse> {
    // console.log(`task date = ${taskDate}`)
    try {
      const sentDate = new Date(taskDate);
      const today = new Date();
      // const isToday = isSameDay(sentDate, today);
      const isBeforeToday = isBefore(startOfDay(sentDate), today);
      const isAfterToday = isAfter(startOfDay(sentDate), today);

      if (isAfterToday) {
        return {
          status: "bad_request",
          message: "Attendance cannot be marked before task starts.",
        };
      }

      const existing = await prisma.attendance.findFirst({
        where: {
          userId: userId,
          taskId: taskId,
          // date: startOfDay(today),
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
            marked: true,
            isLate: isBeforeToday,
            score: 5
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

  async getUserDailyTaskAttendance(userId: string, taskId: string) {
    try {
      const getAttendance = await prisma.attendance.findFirst({
        where: {
          userId: userId,
          taskId: taskId,
        },
      });
      return {
        status: "success",
        message: "Attendance record fetched.",
        data: getAttendance ? true : false,
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
