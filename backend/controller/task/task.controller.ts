import {
  createAcademyCohortSchema,
  createAcademyTaskTypeSchema,
  createAcademyWeekSchema,
} from "@/backend/dto/task.dto";
import { TaskService } from "@/backend/service/task.service";
import { ApiResponse } from "@/backend/types/apiResponse";

export class TaskController {
  constructor(private taskService: TaskService) {}

  async createCohort(request: Request): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = createAcademyCohortSchema.parse(body);
      return await this.taskService.createAcademyCohort(validatedData);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async createTaskType(request: Request): Promise<ApiResponse> {
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

  async createWeek(request: Request): Promise<ApiResponse> {
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
}
