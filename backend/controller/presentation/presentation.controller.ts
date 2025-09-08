import { createPresentationSchema } from "@/backend/dto/battalion.dto";
import { PresentationService } from "@/backend/service/presentation.service";
import { ApiResponse } from "@/backend/types/apiResponse";
import { NextRequest } from "next/server";

export class PresentationController {
  constructor(private presentationService: PresentationService) {}

  async createPresentation(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json()
      const validatedData = createPresentationSchema.parse(body)
      return await this.presentationService.addPresentation(validatedData)
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  // async getCohortPresentations()
}