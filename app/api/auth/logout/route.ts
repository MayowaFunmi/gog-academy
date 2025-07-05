import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { userController } from "@/backend/controller/user.controller";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";
import { authMiddleware } from "@/backend/utils/authMiddleware";

const logoutUser = async ({
  request,
  user,
}: {
  request: Request;
  user: User;
}): Promise<NextResponse> => {
  try {
    const result = await userController.logout(request, user);

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

export const POST = authMiddleware(logoutUser);
