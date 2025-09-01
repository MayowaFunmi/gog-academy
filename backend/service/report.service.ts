import { prisma } from "@/lib/prisma";
import { ApiResponse } from "../types/apiResponse";

export class ReportService {
  constructor() {}

  async generateWeeklyReport(weekId: string): Promise<ApiResponse> {
    try {
      const week = await prisma.academicWeek.findUnique({
        where: { id: weekId },
      });
      if (!week) {
        return {
          status: "notFound",
          message: "Academic week not found",
        };
      }
      const [users, taskTypes, submissions, attendances] =
        await prisma.$transaction([
          prisma.user.findMany({
            where: {
              roles: {
                some: {
                  role: {
                    name: "Student",
                  },
                },
              },
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
              matricNumber: true,
              //email: true
            },
          }),
          prisma.academyTaskType.findMany(),
          prisma.taskSubmission.findMany({
            where: {
              isApproved: true,
              academicWeek: {
                startDate: { gte: week.startDate },
                endDate: { lte: week.endDate },
              },
            },
            include: { academicWeek: true, dailyTask: true },
          }),
          prisma.attendance.findMany({
            where: {
              task: {
                academicWeek: {
                  startDate: { gte: week.startDate },
                  endDate: { lte: week.endDate },
                },
              },
            },
            include: { task: true },
          }),
        ]);

      const scoreMap: Record<string, Record<string, number>> = {};

      // Build a lookup map { userId: { taskTypeId: scoreSum } }
      submissions.forEach((sub) => {
        const uMap = (scoreMap[sub.userId] ||= {});
        const prev = uMap[sub.dailyTask.taskTypeId] || 0;
        uMap[sub.dailyTask.taskTypeId] = prev + sub.score;
      });

      attendances.forEach((att) => {
        const uMap = (scoreMap[att.userId] ||= {});
        const prev = uMap[att.task.taskTypeId] || 0;
        uMap[att.task.taskTypeId] = prev + att.score;
      });

      // Transform into format
      const report = users.map((u) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row: Record<string, any> = {
          userId: u.id,
          name: `${u.firstName} ${u.lastName}`,
          matricNumber: u.matricNumber,
        };

        let total = 0;
        taskTypes.forEach((tt) => {
          const score = scoreMap[u.id]?.[tt.id] || 0;
          row[tt.name] = score;
          total += score;
        });

        row["Total"] = total;
        return row;
      });

      return {
        status: "success",
        message: "Weekly report generated successfully",
        data: {
          report,
          taskTypes: taskTypes.map((tt) => tt.name),
        },
      };
    } catch (error) {
      console.error("Error generating weekly report:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}
