import { prisma } from "@/lib/prisma";
import {
  CreateAcademyTaskTypeDto,
  CreateAcademyWeekDto,
  CreateDailyTaskDto,
  CreateTaskSubmissionInput,
} from "../dto/task.dto";
import { ApiResponse } from "../types/apiResponse";
import { slugify } from "../utils/slugify";
import { addDays, differenceInDays } from "date-fns";
import { removeHour } from "../utils/dateFormat";
import { AcademicWeek, AcademyTaskType, DailyTask } from "@prisma/client";
import { renameFile, validateFileSize, validateFileType } from "../utils/file";
import fs from "fs";
import { BadRequestError } from "../utils/BadRequestError";

export class TaskService {
  constructor() {}

  async createAcademyTaskTypes(
    data: CreateAcademyTaskTypeDto
  ): Promise<ApiResponse> {
    try {
      const { name, cohortId } = data;
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

  async getTaskById(taskId: string): Promise<ApiResponse<DailyTask>> {
    try {
      const task = await prisma.dailyTask.findUnique({
        where: { id: taskId },
        include: {
          attendance: true,
          taskSubmissions: true,
        },
      });
      return {
        status: "success",
        message: "Daily Task details retrieved successfully",
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

  async createTaskSubmission(
    input: CreateTaskSubmissionInput
  ): Promise<ApiResponse> {
    const { userId, taskId, weekId, submission, screenshots } = input;

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

    if (Array.isArray(screenshots)) {
      for (const f of screenshots) {
        const typeOk = validateFileType(f.mimetype || "");
        const sizeOk = validateFileSize(f.size || 0);

        if (!typeOk || !sizeOk) {
          // cleanup temp file if present
          try {
            if (f.filepath && fs.existsSync(f.filepath))
              fs.unlinkSync(f.filepath);
          } catch {}
          throw new BadRequestError(
            !typeOk ? "Invalid file type" : "File too large"
          );
        }
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
          score: 5
        },
      });

      const paths: string[] = [];
      if (Array.isArray(screenshots)) {
        for (const f of screenshots) {
          // const fileWithPath = f as typeof f & {
          //   filepath?: string;
          //   originalname?: string;
          // };
          const relPath = renameFile(
            f.filepath ?? "",
            f.originalFilename ?? ""
          );
          paths.push(relPath);
        }
      }

      if (paths.length > 0) {
        await tx.submissionScreenshot.createMany({
          data: paths.map((p) => ({
            submissionId: createdSubmission.id,
            filePath: p,
          })),
        });
      }
      return createdSubmission;
    });
    return {
      status: "success",
      message: "Task submission created successfully",
      data: submissionRecord,
    };
  }
}
