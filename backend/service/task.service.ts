import { prisma } from "@/lib/prisma";
import {
  CreateAcademyTaskTypeDto,
  CreateAcademyWeekDto,
  CreateDailyTaskDto,
} from "../dto/task.dto";
import { ApiResponse } from "../types/apiResponse";
import { slugify } from "../utils/slugify";
import { addDays, differenceInDays } from "date-fns";
import { removeHour } from "../utils/dateFormat";
import { AcademicWeek, AcademyTaskType } from "@prisma/client";

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
        where: { cohortId }
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
      const { title, dayOfWeek, taskTypeId, description, taskLink, taskScriptures, weekId, startTime, endTime, hasExtension, activated } =
        data;
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

      if (taskExists.activated) {
        return {
          status: "bad_request",
          message: "Task is already active",
        };
      }

      const updatedTask = await prisma.$transaction(async (tx) => {
        return tx.dailyTask.update({
          where: { id: taskId },
          data: { activated: true },
        });
      });

      return {
        status: "success",
        message: "Task activated successfully",
        data: updatedTask,
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

  async getAllTaskTypes(cohortId: string): Promise<ApiResponse<AcademyTaskType[]>> {
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
}