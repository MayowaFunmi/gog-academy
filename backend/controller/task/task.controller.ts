import {
  createAcademyTaskTypeSchema,
  createAcademyWeekSchema,
  createDailyTaskSchema,
} from "@/backend/dto/task.dto";
import { TaskService } from "@/backend/service/task.service";
import { ApiResponse } from "@/backend/types/apiResponse";
import { NextRequest } from "next/server";

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
}
