import { prisma } from "@/lib/prisma";
import {
  CreateAcademyTaskTypeDto,
  CreateAcademyWeekDto,
  CreateDailyTaskDto,
  CreateTaskSubmissionInput,
} from "../dto/task.dto";
import {
  ApiResponse,
  DailyTaskDetails,
  PaginationMeta,
} from "../types/apiResponse";
import { slugify } from "../utils/slugify";
import { addDays, differenceInDays } from "date-fns";
import { removeHour } from "../utils/dateFormat";
import {
  AcademicWeek,
  AcademyTaskType,
  DailyTask,
  SubmissionStatus,
  TaskSubmission,
} from "@prisma/client";
import {
  ensureUploadDir,
  validateFileSize,
  validateFileType,
} from "../utils/file";
import fs from "fs";
import path from "path";

export class TaskService {
  constructor() {}

  async createAcademyTaskTypes(
    data: CreateAcademyTaskTypeDto
  ): Promise<ApiResponse> {
    try {
      const {
        name,
        cohortId,
        requiresAttendance,
        requiresSubmissions,
        requiresMark,
      } = data;
      const cohort = await prisma.academyCohort.findUnique({
        where: { id: cohortId },
      });

      if (!cohort) {
        return {
          status: "notFound",
          message: "Cohort not found",
        };
      }

      const slugified = slugify(name);

      const task = await prisma.academyTaskType.findFirst({
        where: { slug: slugified },
      });

      if (task) {
        return {
          status: "conflict",
          message: "Task already exists",
        };
      }

      const taskType = await prisma.$transaction(async (tx) => {
        const newTask = await tx.academyTaskType.create({
          data: {
            cohortId,
            slug: slugified,
            name: name.trim().toLowerCase(),
            requiresAttendance,
            requiresSubmissions,
            requiresMark,
          },
        });
        return newTask;
      });
      return {
        status: "success",
        message: "Task type created successfully",
        data: taskType,
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

  // added to creating coohort
  async createNewWeek(data: CreateAcademyWeekDto): Promise<ApiResponse> {
    try {
      const { cohortId, weekNumber, startDate, endDate } = data;
      const cohort = await prisma.academyCohort.findUnique({
        where: { id: cohortId },
      });

      if (!cohort) {
        return {
          status: "notFound",
          message: "Cohort not found",
        };
      }
      const dateStarted = new Date(startDate);
      const dateEnded = new Date(endDate);
      const diff = differenceInDays(dateEnded, dateStarted);

      if (
        dateStarted < cohort.startDate ||
        dateEnded > cohort.endDate ||
        dateEnded < dateStarted ||
        diff !== 6
      ) {
        return {
          status: "error",
          message: "check the week's start and end date",
        };
      }

      const weekExists = await prisma.academicWeek.findFirst({
        where: { cohortId, weekNumber },
      });

      if (weekExists) {
        return {
          status: "conflict",
          message: `Week ${weekNumber} has been created alreday`,
        };
      }

      const createdWeek = await prisma.$transaction(async (tx) => {
        const newWeek = await tx.academicWeek.create({
          data: {
            cohortId,
            weekNumber,
            startDate,
            endDate,
          },
        });
        return newWeek;
      });
      return {
        status: "success",
        message: `Week ${weekNumber} created successfully`,
        data: createdWeek,
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

  async getCohortWeeks(cohortId: string): Promise<ApiResponse<AcademicWeek[]>> {
    try {
      const cohortWeeks = await prisma.academicWeek.findMany({
        where: { cohortId },
      });
      return {
        status: "success",
        message: "Cohort weeks retrieved successfully",
        data: cohortWeeks,
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

  async createDailyTask(data: CreateDailyTaskDto): Promise<ApiResponse> {
    try {
      const {
        title,
        dayOfWeek,
        taskTypeId,
        description,
        taskLink,
        taskScriptures,
        weekId,
        startTime,
        endTime,
        hasExtension,
        activated,
      } = data;
      // console.log({ title, dayOfWeek, taskTypeId, description, taskLink, taskScriptures, weekId, startTime, endTime, hasExtension, activated });

      const taskType = await prisma.academyTaskType.findUnique({
        where: { id: taskTypeId },
      });

      if (!taskType) {
        return {
          status: "notFound",
          message: "Task category not found",
        };
      }

      const week = await prisma.academicWeek.findUnique({
        where: { id: weekId },
      });

      if (!week) {
        return {
          status: "notFound",
          message: "Week not found",
        };
      }

      const start = removeHour(new Date(startTime));
      const end = removeHour(new Date(endTime));

      // console.log({ start, end });

      if (start > end || start < week.startDate || end > week.endDate) {
        return {
          status: "error",
          message: "check the start and/or end date(s)",
        };
      }

      const correctStart = addDays(week.startDate, dayOfWeek - 1);
      // console.log({ correctStart });
      if (start < correctStart || end < correctStart) {
        return {
          status: "error",
          message: "check the start date and/or end date",
        };
      }

      const createdTask = await prisma.$transaction(async (tx) => {
        const newTask = await tx.dailyTask.create({
          data: {
            title: title ? title : taskType.name,
            taskTypeId,
            description,
            taskLink,
            taskScriptures,
            weekId,
            dayOfWeek,
            startTime: start,
            endTime: end,
            hasExtension,
            activated,
          },
        });
        return newTask;
      });
      return {
        status: "success",
        message: `Daily task created successfully`,
        data: createdTask,
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

  async getTasksForWeek(weekId: string): Promise<ApiResponse<DailyTask[]>> {
    try {
      const tasks = await prisma.dailyTask.findMany({
        where: { weekId },
        include: {
          academicWeek: true,
          taskType: true,
        },
        orderBy: {
          dayOfWeek: "asc",
        },
      });

      if (tasks.length === 0) {
        return {
          status: "notFound",
          message: "Task not found for this week",
        };
      }
      return {
        status: "success",
        message: `Weekly tasks retrieved successfully`,
        data: tasks,
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

  async activateDailyTask(taskId: string): Promise<ApiResponse> {
    try {
      const taskExists = await prisma.dailyTask.findUnique({
        where: { id: taskId },
      });
      if (!taskExists) {
        return {
          status: "notFound",
          message: "Task not found",
        };
      }

      const updatedTask = await prisma.$transaction(async (tx) => {
        return tx.dailyTask.update({
          where: { id: taskId },
          data: { activated: taskExists.activated ? false : true },
        });
      });

      const message = updatedTask.activated
        ? "Task activated successfully"
        : "Task deactivated successfully";

      return {
        status: "success",
        message: message,
        // data: updatedTask,
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

  async getAllTaskTypes(
    cohortId: string
  ): Promise<ApiResponse<AcademyTaskType[]>> {
    try {
      const taskTypes = await prisma.academyTaskType.findMany({
        where: { cohortId },
      });
      return {
        status: "success",
        message: "Task categories retrieved successfully",
        data: taskTypes,
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

  async getStudentTaskById(taskId: string): Promise<ApiResponse<DailyTask>> {
    try {
      const task = await prisma.dailyTask.findUnique({
        where: { id: taskId },
        include: {
          taskType: true,
        },
      });

      if (!task) {
        return {
          status: "notFound",
          message: "Task not found",
        };
      }

      return {
        status: "success",
        message: "Task retrieved successfully",
        data: task,
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

  async getTaskById(
    taskId: string,
    attendancePage: number = 1,
    attendancePageSize: number = 10,
    submissionPage: number = 1,
    submissionPageSize: number = 10
  ): Promise<ApiResponse<DailyTaskDetails>> {
    try {
      const [
        task,
        totalAttendance,
        attendance,
        totalSubmissions,
        taskSubmissions,
      ] = await Promise.all([
        prisma.dailyTask.findUnique({
          where: { id: taskId },
          include: { taskType: true },
        }),
        prisma.attendance.count({ where: { taskId } }),
        prisma.attendance.findMany({
          where: { taskId },
          include: { user: true },
          skip: (attendancePage - 1) * attendancePageSize,
          take: attendancePageSize,
          orderBy: { attendedAt: "desc" },
        }),
        prisma.taskSubmission.count({ where: { taskId } }),
        prisma.taskSubmission.findMany({
          where: { taskId },
          include: { user: true, screenshots: true },
          skip: (submissionPage - 1) * submissionPageSize,
          take: submissionPageSize,
          orderBy: { submittedAt: "desc" },
        }),
      ]);

      if (!task) {
        return {
          status: "notFound",
          message: "Task not found",
        };
      }

      const attendanceMeta: PaginationMeta = {
        totalItems: totalAttendance,
        totalPages: Math.ceil(totalAttendance / attendancePageSize),
        currentPage: attendancePage,
        pageSize: attendancePageSize,
        hasNextPage: attendancePage * attendancePageSize < totalAttendance,
        hasPreviousPage: attendancePage > 1,
      };

      const submissionsMeta: PaginationMeta = {
        totalItems: totalSubmissions,
        totalPages: Math.ceil(totalSubmissions / submissionPageSize),
        currentPage: submissionPage,
        pageSize: submissionPageSize,
        hasNextPage: submissionPage * submissionPageSize < totalSubmissions,
        hasPreviousPage: submissionPage > 1,
      };

      return {
        status: "success",
        message: "Daily Task details retrieved successfully",
        data: {
          ...task,
          attendance,
          attendanceMeta,
          taskSubmissions,
          submissionsMeta,
        },
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

  async createTaskSubmission(
    input: CreateTaskSubmissionInput
  ): Promise<ApiResponse> {
    const { userId, taskId, weekId, submission, screenshots } = input;

    if (!screenshots && !submission) {
      return {
        status: "bad_request",
        message: "At least one of screenshots or submission is required",
      };
    }

    const [userExists, taskWithWeek] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.dailyTask.findUnique({
        where: { id: taskId },
        include: { academicWeek: true },
      }),
    ]);

    if (
      !userExists ||
      !taskWithWeek ||
      !taskWithWeek.academicWeek ||
      taskWithWeek.academicWeek.id !== weekId
    ) {
      return {
        status: "notFound",
        message: "User, task, or week not found",
      };
    }
    // prepare upload dir
    const uploadDir = ensureUploadDir();
    const savedPaths: string[] = [];
    if (screenshots) {
      for (const file of screenshots) {
        const typeOk = validateFileType(file.type);
        const sizeOk = validateFileSize(file.size);

        if (!typeOk || !sizeOk) {
          return {
            status: "bad_request",
            message: !typeOk ? "Invalid file type" : "File size too large",
          };
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueName = `${Date.now()}-${file.name}`;
        const savePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(savePath, buffer);
        savedPaths.push(path.relative(process.cwd(), savePath));
      }
    }

    const isLate = new Date() > taskWithWeek.endTime;

    const submissionRecord = await prisma.$transaction(async (tx) => {
      const createdSubmission = await tx.taskSubmission.create({
        data: {
          userId,
          taskId,
          weekId,
          submission: submission ?? null,
          isLate,
          // score: 5,
          status: SubmissionStatus.SUBMITTED,
        },
      });

      if (savedPaths.length > 0) {
        await tx.submissionScreenshot.createMany({
          data: savedPaths.map((p) => ({
            submissionId: createdSubmission.id,
            filePath: p,
          })),
        });
      }

      // await tx.dailyTask.update({
      //   where: { id: taskId },
      //   data: { isSubmitted: true },
      // });

      return createdSubmission;
    });
    return {
      status: "success",
      message: "Task submission created successfully",
      data: submissionRecord,
    };
  }

  async approveTaskSubmission(submissionId: string): Promise<ApiResponse> {
    try {
      const submission = await prisma.taskSubmission.findUnique({
        where: { id: submissionId },
      });

      if (!submission) {
        return {
          status: "notFound",
          message: "Submission not found",
        };
      }

      const updatedSubmission = await prisma.$transaction(async (tx) => {
        return await tx.taskSubmission.update({
          where: { id: submissionId },
          data: {
            status:
              submission.status === SubmissionStatus.SUBMITTED
                ? SubmissionStatus.APPROVED
                : submission.status === SubmissionStatus.APPROVED
                ? SubmissionStatus.REJECTED
                : SubmissionStatus.APPROVED,
            score:
              submission.status === SubmissionStatus.APPROVED
                ? { decrement: 5 } // was approved, now disapproving → decrease
                : { increment: 5 }, // was not approved, now approving → increase
          },
        });
      });

      const message =
        updatedSubmission.status === SubmissionStatus.APPROVED
          ? "Submission approved successfully"
          : "Submission rejected";
      console.log(`updated = ${JSON.stringify(updatedSubmission, null, 2)}`);

      return {
        status: "success",
        message: message,
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

  async getWeeklySubmissionsByApproval(
    weekId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<
    ApiResponse<{
      approved: { items: TaskSubmission[]; meta: PaginationMeta };
      unapproved: { items: TaskSubmission[]; meta: PaginationMeta };
    }>
  > {
    const week = await prisma.academicWeek.findUnique({
      where: { id: weekId },
    });
    if (!week) {
      return {
        status: "notFound",
        message: "Week not found",
        data: null,
      };
    }

    const skip = (page - 1) * pageSize;

    try {
      const [approvedCount, unapprovedCount, approved, unapproved] =
        await Promise.all([
          prisma.taskSubmission.count({
            where: { weekId, status: SubmissionStatus.APPROVED },
          }),
          prisma.taskSubmission.count({
            where: { weekId, status: { not: SubmissionStatus.APPROVED } },
          }),
          prisma.taskSubmission.findMany({
            where: { weekId, status: SubmissionStatus.APPROVED },
            skip,
            take: pageSize,
            include: {
              user: { include: { userProfile: true } },
              academicWeek: true,
              dailyTask: true,
              screenshots: true,
            },
            orderBy: {
              submittedAt: "desc",
            },
          }),
          prisma.taskSubmission.findMany({
            where: { weekId, status: { not: SubmissionStatus.APPROVED } },
            skip,
            take: pageSize,
            include: {
              user: { include: { userProfile: true } },
              academicWeek: true,
              dailyTask: true,
              screenshots: true,
            },
            orderBy: {
              submittedAt: "desc",
            },
          }),
        ]);

      const approvedMeta: PaginationMeta = {
        totalItems: approvedCount,
        totalPages: Math.ceil(approvedCount / pageSize),
        currentPage: page,
        pageSize,
        hasNextPage: page * pageSize < approvedCount,
        hasPreviousPage: page > 1,
      };

      const unapprovedMeta: PaginationMeta = {
        totalItems: unapprovedCount,
        totalPages: Math.ceil(unapprovedCount / pageSize),
        currentPage: page,
        pageSize,
        hasNextPage: page * pageSize < unapprovedCount,
        hasPreviousPage: page > 1,
      };

      return {
        status: "success",
        message: "Submissions retrieved successfully",
        data: {
          approved: { items: approved, meta: approvedMeta },
          unapproved: { items: unapproved, meta: unapprovedMeta },
        },
      };
    } catch (error) {
      console.error("Error retrieving submissions:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  async getUserTaskSubmission(
    userId: string,
    taskId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const taskSubmission = await prisma.taskSubmission.findFirst({
        where: { userId, taskId },
      });
      return {
        status: "success",
        message: "User task submission retrieved successfully",
        data: taskSubmission ? true : false,
      };
    } catch (error) {
      console.error("Error retrieving submissions:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}
