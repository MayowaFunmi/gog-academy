// services/user.service.ts
import { prisma } from "@/lib/prisma";
import {
  UserLoginDto,
  UserProfileDto,
  UserRegistrationDto,
} from "../dto/user.dto";
import { ApiResponse, PaginationMeta } from "../types/apiResponse";
import { hashPassowrd, validatePassword } from "../providers/passwords";
import { createUniqueCode } from "@/app/utils/createUniqueCode";
import { PayloadType } from "../types/payload";
import { signJwt } from "../providers/jwtProvider";
import { User, UserProfile } from "@prisma/client";

export class UserService {
  constructor() {}

  async createUser(data: UserRegistrationDto): Promise<ApiResponse> {
    try {
      const {
        username,
        firstName,
        lastName,
        gender,
        email,
        phoneNumber,
        password,
        role,
      } = data;

      // Check for existing user
      const userExists = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }, { phoneNumber }],
        },
      });

      if (userExists) {
        return {
          status: "conflict",
          message: "User with username, email or phone number already exists",
          data: null,
        };
      }

      const existingRole = await prisma.role.findUnique({
        where: { name: role },
      });

      if (!existingRole) {
        return {
          status: "notFound",
          message: `Role '${role}' does not exist`,
          data: null,
        };
      }

      const hashedPassword = await hashPassowrd(password);
      if (!hashedPassword) {
        return {
          status: "error",
          message: "Failed to hash password",
          data: null,
        };
      }

      const uniqueId = createUniqueCode();

      const user = await prisma.$transaction(async (tx) => {
        // Create user
        const newUser = await tx.user.create({
          data: {
            username,
            uniqueId,
            firstName,
            lastName,
            gender,
            email,
            phoneNumber,
            password: hashedPassword,
            profileStrength: 30,
          },
        });

        // Assign role
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: existingRole.id,
          },
        });

        return newUser;
      });

      return {
        status: "success",
        message: "User created successfully",
        data: {
          ...user,
          password: undefined,
          // roles: [{ role: { name: role } }],
          roles: [role],
        },
      };
    } catch (error) {
      console.error("Error creating user:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  /**
   * Logs in a user with the provided credentials.
   * @param data - The login credentials.
   * @returns An ApiResponse containing the login result.
   */
  async login(data: UserLoginDto): Promise<ApiResponse> {
    try {
      const { username, password } = data;
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: username }, { phoneNumber: username }, { username }],
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        return {
          status: "notFound",
          message: "User not found",
        };
      }

      const isValidPassword = await validatePassword(password, user.password);
      if (!isValidPassword) {
        return {
          status: "unauthorized",
          message: "Invalid password",
        };
      }

      const payload: PayloadType = {
        id: user.id,
        email: user.email,
        roles: user.roles.map((role) => role.role.name),
      };

      const token = signJwt(payload);
      if (!token) {
        return {
          status: "error",
          message: "Failed to generate token",
        };
      }
      const [updatedUser] = await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
            userProfile: true,
          },
          data: { isActive: true },
        }),
      ]);

      // await prisma.$transaction(async (tx) => {
      //   await tx.user.update({
      //     where: { id: user.id },
      //     data: { isActive: true },
      //   });

      //   await tx.loginLog.create({
      //     data: { userId: user.id, success: true },
      //   });

      //   throw new Error("simulate failure"); // would rollback both above
      // });

      return {
        status: "success",
        message: "Login successful",
        data: {
          user: {
            ...updatedUser,
            password: undefined,
            roles: updatedUser.roles.map((role) => role.role.name),
          },
          token,
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

  async logout(userId: string): Promise<ApiResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return {
          status: "notFound",
          message: "User not found",
        };
      }

      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false },
      });

      return {
        status: "success",
        message: "Logout successful",
        data: null,
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

  async createUserProfile(
    data: UserProfileDto,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const {
        title,
        cohortId,
        dateOfBirth,
        address,
        stateOfResidence,
        country,
        maritalStatus,
        salvationStatus,
        salvationStory,
        gogMembershipYear,
        gogMembershipStatus,
        classCommitmentStatus,
        assignmentCommitmentStatus,
        reasonForJoining,
        churchName,
        occupation,
        profilePicture,
        refereeName,
        refereePhoneNumber,
        refereeEmail,
        refereeRelationship,
        consentCheck,
      } = data;

      const cohort = await prisma.academyCohort.findUnique({
        where: { id: cohortId },
      });

      if (!cohort) {
        return {
          status: "notFound",
          message: "Cohort not found",
        };
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { userProfile: true },
      });

      if (!user) {
        return {
          status: "notFound",
          message: "User not found",
        };
      }
      if (user.userProfile) {
        return {
          status: "conflict",
          message: "User already has a profile",
        };
      }

      if (!consentCheck) {
        return {
          status: "bad_request",
          message: "User must provide consent",
        };
      }

      const profile = await prisma.$transaction(async (tx) => {
        const newProfile = await tx.userProfile.create({
          data: {
            userId,
            cohortId,
            title,
            dateOfBirth: new Date(dateOfBirth),
            address,
            stateOfResidence,
            country,
            maritalStatus,
            salvationStatus,
            salvationStory,
            gogMembershipStatus,
            gogMembershipYear,
            classCommitmentStatus,
            assignmentCommitmentStatus,
            reasonForJoining,
            churchName,
            occupation,
            profilePicture,
            refereeName,
            refereePhoneNumber,
            refereeEmail,
            refereeRelationship,
            consentCheck,
          },
        });

        const profileStrength = 70;
        await tx.user.update({
          where: { id: userId },
          data: { profileStrength },
        });
        return newProfile;
      });

      return {
        status: "success",
        message: "User profile created successfully",
        data: profile,
      };
    } catch (error) {
      console.error("Error logging in user:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getUserProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    try {
      const userProfile = await prisma.userProfile.findUnique({
        where: { userId },
      });
      if (!userProfile) {
        return {
          status: "notFound",
          message: "User profile not found",
        };
      }
      return {
        status: "success",
        message: "User profile fetched successfully",
        data: userProfile,
      };
    } catch (error) {
      console.error("Error logging in user:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{ users: User[]; pagination: PaginationMeta }>> {
    try {
      const skip = (page - 1) * limit;
      const [totalItems, users] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: "asc",
          },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
            userProfile: true,
          },
        }),
      ]);

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
        message: "Users fetched successfully",
        data: {
          users: users.map((u) => ({ ...u, password: "" })),
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

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    if (!userId) {
      return {
        status: "bad_request",
        message: "User Id cannot be null",
      };
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          userProfile: true,
        },
      });

      if (!user) {
        return {
          status: "notFound",
          message: "User not found",
        };
      }
      return {
        status: "success",
        message: "User fetched successfully",
        data: user,
      };
    } catch (error) {
      console.error("Error logging in user:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async getActiveUsers(): Promise<ApiResponse<User[]>> {
    try {
      const users = await prisma.user.findMany({
        where: { isActive: true },
      });
      return {
        status: "success",
        message: "Active Users fetched successfully",
        data: users,
      };
    } catch (error) {
      console.error("Error logging in user:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }
}
