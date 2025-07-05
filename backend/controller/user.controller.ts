import { ZodError } from "zod";
import { User } from "@prisma/client";
import { ApiResponse } from "../types/apiResponse";
import { userLoginSchema, userRegistrationSchema } from "../dto/user.dto";
import { userService } from "../service/user.service";

export const userController = {
  async register(request: Request): Promise<ApiResponse<User | unknown>> {
    try {
      const body = await request.json();
      const validatedData = userRegistrationSchema.parse(body);

      return await userService.createUser(validatedData);
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
  },

  async login(request: Request): Promise<ApiResponse> {
    try {
      const body = await request.json();
      const validatedData = userLoginSchema.parse(body);

      return await userService.login(validatedData);
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
  },

  async logout(request: Request, user: User): Promise<ApiResponse> {
    return await userService.logout(user.id);
  }
};
