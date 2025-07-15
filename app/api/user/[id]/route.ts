import { userController } from "@/backend/controller/user/user.module";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> => {
  try {
    const { id } = await context.params;
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
