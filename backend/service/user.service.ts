// services/user.service.ts
import { prisma } from "@/lib/prisma";
import {
  UserLoginDto,
  UserProfileDto,
  UserRegistrationDto,
} from "../dto/user.dto";
import { ApiResponse } from "../types/apiResponse";
import { hashPassowrd, validatePassword } from "../providers/passwords";
import { createUniqueCode } from "@/app/utils/createUniqueCode";
import { PayloadType } from "../types/payload";
import { signJwt } from "../providers/jwtProvider";

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
        gogMembershipDate,
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
        where: { id: cohortId }
      })

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

      const profile = await prisma.$transaction(async (tx) => {
        const newProfile = await tx.userProfile.create({
          data: {
            userId,
            cohortId,
            title,
            dateOfBirth,
            address,
            stateOfResidence,
            country,
            maritalStatus,
            salvationStatus,
            salvationStory,
            gogMembershipStatus,
            gogMembershipDate,
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
        return newProfile;
      });
      return {
        status: "success",
        message: "User prifle created successfully",
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
}
