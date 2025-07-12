import { prisma } from "@/lib/prisma";
import {
  CreateAcademyCohortDto,
  CreateAcademyTaskTypeDto,
  CreateAcademyWeekDto,
} from "../dto/task.dto";
import { ApiResponse } from "../types/apiResponse";
import { generateCohortSlug, slugify } from "../utils/slugify";
import { differenceInDays } from "date-fns";

export class TaskService {
  constructor() {}

  async createAcademyCohort(
    data: CreateAcademyCohortDto
  ): Promise<ApiResponse> {
    try {
      const { cohort, batch, startDate, endDate } = data;

      const dateStarted = new Date(startDate)
      const dateEnded = new Date(endDate)

      if (dateStarted < dateEnded) {
        return {
        status: "error",
        message: "Start date must be after end date",
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

  async createAcademyTaskTypes(
    data: CreateAcademyTaskTypeDto
  ): Promise<ApiResponse> {
    try {
      const { name, cohortId } = data;
      const cohort = await prisma.academyCohort.findUnique({
        where: { id: cohortId },
      });

      if (!cohort) {
        return {
          status: "notFound",
          message: "Cohort not found",
        };
      }

      const slugified = slugify(name);

      const task = await prisma.academyTaskType.findFirst({
        where: { slug: slugified },
      });

      if (task) {
        return {
          status: "conflict",
          message: "Task already exists",
        };
      }

      const taskType = await prisma.$transaction(async (tx) => {
        const newTask = await tx.academyTaskType.create({
          data: {
            cohortId,
            slug: slugified,
            name: name.trim().toLowerCase(),
          },
        });
        return newTask;
      });
      return {
        status: "success",
        message: "Task type created successfully",
        data: taskType,
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

  async createNewWeek(data: CreateAcademyWeekDto): Promise<ApiResponse> {
    try {
      const { cohortId, weekNumber, startDate, endDate } = data;
      const cohort = await prisma.academyCohort.findUnique({
        where: { id: cohortId },
      });

      if (!cohort) {
        return {
          status: "notFound",
          message: "Cohort not found",
        };
      }
      const dateStarted = new Date(startDate);
      const dateEnded = new Date(endDate);
      const diff = differenceInDays(dateEnded, dateStarted);

      if (
        dateStarted < cohort.startDate ||
        dateEnded > cohort.endDate ||
        dateEnded < dateStarted ||
        diff !== 6
      ) {
        return {
          status: "error",
          message: "check the week's start and end date",
        };
      }

      const weekExists = await prisma.academicWeek.findFirst({
        where: { cohortId, weekNumber },
      });

      if (weekExists) {
        return {
          status: "conflict",
          message: `Week ${weekNumber} has been created alreday`,
        };
      }

      const createdWeek = await prisma.$transaction(async (tx) => {
        const newWeek = await tx.academicWeek.create({
          data: {
            cohortId,
            weekNumber,
            startDate,
            endDate,
          },
        });
        return newWeek;
      });
      return {
        status: "success",
        message: `Week ${weekNumber} created successfully`,
        data: createdWeek,
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
}
