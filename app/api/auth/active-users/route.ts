import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { userController } from "@/backend/controller/user/user.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextResponse } from "next/server";

const getActiveUsers = async (): Promise<NextResponse> => {
  try {
    const result = await userController.getActiveUsers();
    return NextResponse.json(
      {
        status: result.status,
        message: result.message,
        data: result.data ?? null,
      },
      {
        status: mapHttpStatus(result.status),
      }
    );
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

export const GET = authMiddleware(getActiveUsers)