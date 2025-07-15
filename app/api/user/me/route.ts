import { userController } from "@/backend/controller/user/user.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const userDetails = async (
  request: NextRequest,
  context: { user: Promise<User> }
): Promise<NextResponse> => {
  try {
    const { id } = await context.user;
    if (!id) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "User Id cannot be empty",
        },
        { status: 500 }
      );
    }
    const response = await userController.getUserById(id)
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred during logout",
      },
      { status: 500 }
    );
  }
};

export const GET = authMiddleware(userDetails)