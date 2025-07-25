import { createAcademyCohortSchema } from "@/backend/dto/task.dto";
import { CohortService } from "@/backend/service/cohort.service";
import { ApiResponse } from "@/backend/types/apiResponse";
import { NextRequest } from "next/server";

export class CohortController {
  constructor(private cohortService: CohortService) {}

  async createCohort(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = createAcademyCohortSchema.parse(body);
      return await this.cohortService.createAcademyCohort(validatedData);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getAllCohorts(page = 1, limit = 10) {
    return await this.cohortService.getAllCohorts(page, limit);
  }

  async getCohortById(cohortId: string): Promise<ApiResponse> {
    try {
      return await this.cohortService.getCohortById(cohortId);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }
}
