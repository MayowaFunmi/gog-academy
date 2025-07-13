import { ZodError } from "zod";
import { User } from "@prisma/client";
import { ApiResponse } from "../../types/apiResponse";
import {
  userLoginSchema,
  userProfileSchema,
  userRegistrationSchema,
} from "../../dto/user.dto";
import { UserService } from "../../service/user.service";
import { NextRequest } from "next/server";

export class UserController {
  constructor(private userService: UserService) {}

  async register(request: NextRequest): Promise<ApiResponse<User | unknown>> {
    try {
      const body = await request.json();
      const validatedData = userRegistrationSchema.parse(body);

      return await this.userService.createUser(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return {
          status: "validation_error",
          message: "Validation failed",
          data: validationErrors,
        };
      }

      console.error("Unhandled controller error:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  async login(request: NextRequest): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = userLoginSchema.parse(body);

      return await this.userService.login(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return {
          status: "validation_error",
          message: "Validation failed",
          data: validationErrors,
        };
      }

      console.error("Unhandled controller error:", error);

      return {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  async logout(request: NextRequest, user: User): Promise<ApiResponse> {
    try {
      return await this.userService.logout(user.id);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }

  async createUserProfile(
    request: NextRequest,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = userProfileSchema.parse(body);
      return await this.userService.createUserProfile(validatedData, userId);
    } catch (error) {
      console.error("Unhandled controller error:", error);
      return {
        status: "error",
        message: "An unexpected error occurred",
      };
    }
  }
}
