import {
  createAcademyTaskTypeSchema,
  createAcademyWeekSchema,
  createDailyTaskSchema,
  taskSubmissionSchema,
} from "@/backend/dto/task.dto";
import { TaskService } from "@/backend/service/task.service";
import { ApiResponse } from "@/backend/types/apiResponse";
import { parseForm } from "@/backend/utils/file";
import { NextRequest } from "next/server";
import type { File } from "formidable";

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createTaskType(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = createAcademyTaskTypeSchema.parse(body);
      return await this.taskService.createAcademyTaskTypes(validatedData);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async createWeek(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = createAcademyWeekSchema.parse(body);
      return await this.taskService.createNewWeek(validatedData);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getCohortWeeks(cohortId: string): Promise<ApiResponse> {
    try {
      return await this.taskService.getCohortWeeks(cohortId);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async createDailyTask(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = createDailyTaskSchema.parse(body);
      return await this.taskService.createDailyTask(validatedData);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getWeeklyTasks(weekId: string): Promise<ApiResponse> {
    return await this.taskService.getTasksForWeek(weekId);
  }

  async getTaskDetail(taskId: string): Promise<ApiResponse> {
    return await this.taskService.getTaskById(taskId);
  }

  async updateTaskActivation(taskId: string): Promise<ApiResponse> {
    try {
      return await this.taskService.activateDailyTask(taskId);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getTaskTypes(cohortId: string): Promise<ApiResponse> {
    try {
      return await this.taskService.getAllTaskTypes(cohortId);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async submitTask(request: NextRequest): Promise<ApiResponse> {
    try {
      const { fields, files } = await parseForm(request);
      const userId = String(fields.userId ?? "");
      const taskId = String(fields.taskId ?? "");
      const weekId = String(fields.weekId ?? "");
      const submission = fields.submission ? String(fields.submission) : null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawScreens = (files as any).screenshots as
        | File
        | File[]
        | undefined;

      const screenshots: File[] = Array.isArray(rawScreens)
        ? rawScreens.filter(Boolean)
        : rawScreens
        ? [rawScreens]
        : [];

      const validated = taskSubmissionSchema.parse({
        userId,
        taskId,
        weekId,
        submission,
      });

      return await this.taskService.createTaskSubmission({
        ...validated,
        screenshots,
        submission: submission ?? null,
      });
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }
}
