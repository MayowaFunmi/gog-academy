import {
  createAcademyTaskTypeSchema,
  createAcademyWeekSchema,
  createDailyTaskSchema,
  taskSubmissionSchema,
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

  async getStudentTaskDetail(taskId: string): Promise<ApiResponse> {
    return await this.taskService.getStudentTaskById(taskId)
  }

  async getTaskDetail(
    taskId: string,
    attendancePage: number,
    attendancePageSize: number,
    submissionPage: number,
    submissionPageSize: number
  ): Promise<ApiResponse> {
    return await this.taskService.getTaskById(
      taskId,
      attendancePage,
      attendancePageSize,
      submissionPage,
      submissionPageSize
    );
  }

  async updateTaskActivation(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const { taskId } = body;
      if (!taskId) {
        return {
          status: "error",
          message: "Task ID is required",
        };
      }
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
      const formData = await request.formData();

      const userId = String(formData.get("userId") ?? "");
      const taskId = String(formData.get("taskId") ?? "");
      const weekId = String(formData.get("weekId") ?? "");
      const submission = formData.get("submission")
        ? String(formData.get("submission"))
        : null;

      // Screenshots come as File objects (nullable, multiple allowed)
      const rawScreens = formData.getAll("screenshots") as File[];
      const screenshots = rawScreens.filter(
        (f) => f instanceof File && f.size > 0
      );

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

  async approveSubmission(request: NextRequest): Promise<ApiResponse> {
    const body = await request.json();
    const { submissionId } = body;
    if (!submissionId) {
      return {
        status: "error",
        message: "Submission ID is required",
      };
    }
    return await this.taskService.approveTaskSubmission(submissionId);
  }

  async getSubmissionApproval(
    weekId: string,
    page: number,
    perPage: number
  ): Promise<ApiResponse> {
    try {
      return await this.taskService.getWeeklySubmissionsByApproval(
        weekId,
        page,
        perPage
      );
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getUserSubmissions(
    userId: string,
    taskId: string
  ): Promise<ApiResponse> {
    try {
      return await this.taskService.getUserTaskSubmission(userId, taskId);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  // async approveSubmission(
  //   submissionId: string,
  //   approved: boolean
  // ): Promise<ApiResponse> {
  //   try {
  //     return await this.taskService.approveOrRejectSubmission(
  //       submissionId,
  //       approved
  //     );
  //   } catch (error) {
  //     console.error("Unhandled controller error:", error);
  //     return {
  //       status: "error",
  //       message: "An unexpected error occurred",
  //     };
  //   }
  // }
}
