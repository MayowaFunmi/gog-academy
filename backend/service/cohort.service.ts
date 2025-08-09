import { prisma } from "@/lib/prisma";
import { CreateAcademyCohortDto } from "../dto/task.dto";
import { ApiResponse, PaginationMeta } from "../types/apiResponse";
import { generateCohortSlug } from "../utils/slugify";
import { AcademyCohort } from "@prisma/client";
import { addHour, setEndOfDay, setStartOfDay } from "../utils/dateFormat";
import { addDays, isBefore, isSameDay } from "date-fns";

export class CohortService {
  constructor() {}

  async createAcademyCohort(
    data: CreateAcademyCohortDto
  ): Promise<ApiResponse> {
    try {
      const { cohort, batch, startDate, endDate } = data;

      const dateStarted = setStartOfDay(new Date(startDate));
      const dateEnded = setEndOfDay(new Date(endDate));

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
            batch: batch.trim().toUpperCase(),
            slug: String(cohort_slug?.data),
            startDate: dateStarted,
            endDate: dateEnded,
          },
        });

        // generate academic weeks for this cohort
        let currentStart = dateStarted;
        const finalEnd = dateEnded;
        const academicWeeksData = [];

        let weekNumber = 1;

        while (isBefore(currentStart, finalEnd) || isSameDay(currentStart, finalEnd)) {
          const rawEnd = addDays(currentStart, 6);
          const currentEnd = rawEnd > finalEnd ? finalEnd : rawEnd;
          academicWeeksData.push({
            cohortId: newCohort.id,
            startDate: setStartOfDay(currentStart),
            endDate: setEndOfDay(currentEnd),
            weekNumber,
          });
          currentStart = addDays(currentStart, 7);
          weekNumber++;
        }

        await tx.academicWeek.createMany({
          data: academicWeeksData,
        })
        return {
          ...newCohort, startDate: dateStarted, endDate: dateEnded,
        };
      });

      // create academic weeks for this cohort there
      return {
        status: "success",
        message: "Cohort and academic weeks created successfully",
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
    page?: number,
    limit?: number
  ): Promise<
    ApiResponse<{
      cohorts: AcademyCohort[];
      totalUsers: number;
      pagination?: PaginationMeta;
    }>
  > {
    try {
      const isPaginated = typeof page === "number" && typeof limit === "number";

      const [totalItems, cohorts] = await prisma.$transaction([
        prisma.academyCohort.count(),
        prisma.academyCohort.findMany({
          ...(isPaginated
            ? {
                skip: (page - 1) * limit,
                take: limit,
              }
            : {}),
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

      const pagination = isPaginated
        ? {
            totalItems,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            pageSize: limit,
            hasNextPage: page < Math.ceil(totalItems / limit),
            hasPreviousPage: page > 1,
          }
        : undefined;

      return {
        status: "success",
        message: "Cohorts fetched successfully",
        data: {
          cohorts: cohortsWithUserCounts,
          totalUsers: totalUsers.length,
          ...(pagination ? { pagination } : {}),
        },
      };
    } catch (error) {
      console.error("Error fetching cohorts:", error);
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
        data: { 
          ...cohort, 
          startDate: addHour(cohort.startDate),
          endDate: addHour(cohort.endDate),
          academicWeek: cohort?.academicWeek?.map((week) => ({
            ...week,
            startDate: addHour(week.startDate),
            endDate: addHour(week.endDate),
          })),
          userCount: totalUsers 
        },
      };
    } catch (error) {
      console.error("Error fetching cohort:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getCurrentCohort(): Promise<ApiResponse> {
    try {
      const cohort = await prisma.academyCohort.findFirst({
        where: { startDate: { lte: new Date() }, endDate: { gte: new Date() } },
      });
      if (!cohort) {
        return {
          status: "notFound",
          message: "No active cohort found",
        };
      }
      return {
        status: "success",
        message: "Current cohort fetched successfully",
        data: cohort,
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
