import { addBattalionMembersSchema, createBattalionSChema } from "@/backend/dto/battalion.dto";
import { BattalionService } from "@/backend/service/battalion.service";
import { ApiResponse } from "@/backend/types/apiResponse";
import { NextRequest } from "next/server";

export class BattalionController {
  constructor(private battalionService: BattalionService) {}

  async createBattalion(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = createBattalionSChema.parse(body);
      return await this.battalionService.createBattalion(validatedData);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getAllBattalions(cohortId: string): Promise<ApiResponse> {
    return await this.battalionService.getAllCohortBattalions(cohortId);
  }

  async getBattalionById(battalionId: string, cohortId: string): Promise<ApiResponse> {
    return await this.battalionService.getBattalionById(battalionId, cohortId)
  }

  async addBattalionMembers(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = addBattalionMembersSchema.parse(body);
      return await this.battalionService.addMembersToBatalion(validatedData);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getBattalionMembers(battalionId: string): Promise<ApiResponse> {
    return await this.battalionService.getBattalionMembers(battalionId)
  }
}
