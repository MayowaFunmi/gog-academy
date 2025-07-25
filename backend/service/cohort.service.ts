import { prisma } from "@/lib/prisma";
import { CreateAcademyCohortDto } from "../dto/task.dto";
import { ApiResponse, PaginationMeta } from "../types/apiResponse";
import { generateCohortSlug } from "../utils/slugify";
import { AcademyCohort } from "@prisma/client";

export class CohortService {
  constructor() {}

  async createAcademyCohort(
    data: CreateAcademyCohortDto
  ): Promise<ApiResponse> {
    try {
      const { cohort, batch, startDate, endDate } = data;

      const dateStarted = new Date(startDate);
      const dateEnded = new Date(endDate);

      if (dateStarted > dateEnded) {
        return {
          status: "error",
          message: "End date must be after start date",
        };
      }
      const cohort_slug = await generateCohortSlug(cohort, batch);
      if (cohort_slug.status === "conflict") {
        return cohort_slug;
      }

      const createdCohort = await prisma.$transaction(async (tx) => {
        const newCohort = await tx.academyCohort.create({
          data: {
            cohort,
            batch,
            slug: String(cohort_slug?.data),
            startDate,
            endDate,
          },
        });
        return newCohort;
      });
      return {
        status: "success",
        message: "Cohort created successfully",
        data: createdCohort,
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

  async getAllCohorts(
    page: number = 1,
    limit: number = 10
  ): Promise<
    ApiResponse<{
      cohorts: AcademyCohort[];
      totalUsers: number;
      pagination: PaginationMeta;
    }>
  > {
    try {
      const skip = (page - 1) * limit;
      const [totalItems, cohorts] = await prisma.$transaction([
        prisma.academyCohort.count(),
        prisma.academyCohort.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            taskTypes: false,
            academicWeek: false,
          },
        }),
      ]);

      const totalUsers = await prisma.userProfile.groupBy({
        by: ["cohortId"],
        _count: {
          cohortId: true,
        },
      });

      const cohortsWithUserCounts = cohorts.map((cohort) => {
        const countEntry = totalUsers.find((uc) => uc.cohortId === cohort.id);
        return {
          ...cohort,
          userCount: countEntry?._count.cohortId || 0,
        };
      });

      const totalPages = Math.ceil(totalItems / limit);
      const pagination: PaginationMeta = {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
      return {
        status: "success",
        message: "Cohorts fetched successfully",
        data: {
          cohorts: cohortsWithUserCounts,
          totalUsers: totalUsers.length,
          pagination,
        },
      };
    } catch (error) {
      console.error("Error logging in user:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getCohortById(cohortId: string): Promise<ApiResponse> {
    try {
      const cohort = await prisma.academyCohort.findUnique({
        where: { id: cohortId },
        include: {
          taskTypes: true,
          academicWeek: true,
        },
      });

      if (!cohort) {
        return {
          status: "notFound",
          message: "Cohort not found",
        };
      }

      const totalUsers = await prisma.userProfile.count({
        where: { cohortId },
      });

      return {
        status: "success",
        message: "Cohort fetched successfully",
        data: { ...cohort, userCount: totalUsers },
      };
    } catch (error) {
      console.error("Error fetching cohort:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }
}
