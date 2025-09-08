import { prisma } from "@/lib/prisma";
import { CreatePresentationDto } from "../dto/battalion.dto";
import { ApiResponse } from "../types/apiResponse";

export class PresentationService {
  constructor() {}

  // add presentation, get all presentation, get presentation by id, submit presentation, approve presentation
  async addPresentation(data: CreatePresentationDto): Promise<ApiResponse> {
    try {
      const {
        cohortId,
        taskTypeId,
        title,
        description,
        presentationDate,
        submissionDeadline,
      } = data;

      const [cohort, taskType] = await Promise.all([
        prisma.academyCohort.findUnique({
          where: { id: cohortId },
        }),
        prisma.academyTaskType.findUnique({
          where: { id: taskTypeId },
        }),
      ]);

      if (!cohort || !taskType) {
        return {
          status: "notFound",
          message: "Cohort or Battalion or Task Activity not found",
        };
      }

      const presentation = await prisma.presentation.create({
        data: {
          cohortId,
          taskTypeId,
          title,
          description,
          presentationDate,
          submissionDeadline,
        },
      });
      return {
        status: "success",
        message: "Presentation added successfully",
        data: presentation,
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

  async getAllCohortPresentations(cohortId: string): Promise<ApiResponse> {
    try {
      const cohort = await prisma.academyCohort.findUnique({
        where: { id: cohortId },
      });

      if (!cohort) {
        return {
          status: "notFound",
          message: "Cohort not found",
        };
      }

      const presentations = await prisma.presentation.findMany({
        where: {
          cohortId: cohortId,
        },
      });

      return {
        status: "success",
        message: "Presentations retrieved successfully",
        data: presentations,
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

  async getPesentationById(presentationId: string): Promise<ApiResponse> {
    try {
      const presentation = await prisma.presentation.findUnique({
        where: { id: presentationId },
        include: {
          presentationSubmissions: true,
          battalion: { include: { battalion: { include: { members: true } } } },
        },
      });
      if (!presentation) {
        return {
          status: "notFound",
          message: "Presentation not found",
        };
      }
      return {
        status: "success",
        message: "Presentation retrieved successfully",
        data: presentation,
      };
    } catch (error) {
      console.error("Error fetching presentation by id:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}
