import { prisma } from "@/lib/prisma";
import {
  AddBattalionMembersDto,
  CreateBattalionDto,
} from "../dto/battalion.dto";
import { ApiResponse } from "../types/apiResponse";

export class BattalionService {
  constructor() {}

  async createBattalion(data: CreateBattalionDto): Promise<ApiResponse> {
    try {
      const { cohortId, name } = data;
      const battalionExists = await prisma.battalion.findFirst({
        where: { name: name.toLowerCase() },
      });
      if (battalionExists) {
        return {
          status: "conflict",
          message: "Battalion already exists",
        };
      }

      const newBattalion = await prisma.$transaction(async (tx) => {
        const b = await tx.battalion.create({
          data: {
            cohortId,
            name: name.toLowerCase(),
          },
        });
        return b;
      });

      return {
        status: "success",
        message: "Battalion created auccessfuly",
        data: newBattalion,
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

  async getAllCohortBattalions(cohortId: string): Promise<ApiResponse> {
    try {
      const battalion = await prisma.battalion.findMany({
        where: { cohortId },
      });
      if (!battalion) {
        return {
          status: "notFound",
          message: "Battalions not found",
        };
      }
      return {
        status: "success",
        message: "Cohort Battalions retrieved successfully",
        data: battalion,
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

  async getBattalionById(
    battalionId: string,
    cohortId: string
  ): Promise<ApiResponse> {
    try {
      const [battalion, cohort] = await prisma.$transaction([
        prisma.battalion.findUnique({
          where: { id: battalionId },
        }),
        prisma.academyCohort.findUnique({
          where: { id: cohortId },
        }),
      ]);

      if (!battalion || !cohort) {
        return {
          status: "notFound",
          message: "Either Cohort or Battalion not found",
        };
      }
      const newBattalion = await prisma.battalion.findUnique({
        where: { id: battalionId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  matricNumber: true,
                  phoneNumber: true,
                  gender: true,
                },
              },
            },
          },
          presentation: { include: { presentation: true }},
        },
      });

      return {
        status: "success",
        message: "Battalion retrieved successfully",
        data: newBattalion,
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

  async addMembersToBatalion(
    data: AddBattalionMembersDto
  ): Promise<ApiResponse> {
    try {
      const { battalionId, userId } = data;

      const [battalion, user] = await prisma.$transaction([
        prisma.battalion.findUnique({
          where: { id: battalionId },
          include: {
            members: {
              where: { userId },
              select: { id: true },
            },
          },
        }),
        prisma.user.findUnique({ where: { id: userId } }),
      ]);

      if (!battalion || !user) {
        return {
          status: "notFound",
          message: "Battalion or user not found",
        };
      }

      if (battalion.members.length > 0) {
        return {
          status: "conflict",
          message: "User already exists in this battalion",
        };
      }

      // if passed, create new member
      const newMember = await prisma.battalionMember.create({
        data: {
          battalionId,
          userId,
        },
      });

      return {
        status: "success",
        message: "User added to battalion successfully",
        data: newMember,
      };
    } catch (error) {
      console.error("Error adding battalion member:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  async getBattalionMembers(battalionId: string): Promise<ApiResponse> {
    try {
      const battalion = prisma.battalion.findUnique({
        where: { id: battalionId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  matricNumber: true,
                  phoneNumber: true,
                  gender: true,
                },
              },
            },
          },
        },
      });

      if (!battalion) {
        return {
          status: "notFound",
          message: "Battalion or user not found",
        };
      }
      return {
        status: "notFound",
        message: "Battalion or user not found",
      };
    } catch (error) {
      console.error("Error adding battalion member:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}
