import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { userController } from "@/backend/controller/user/user.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

const userProfile = async ({
  request,
  user,
}: {
  request: Request;
  user: User;
}): Promise<NextResponse> => {
  try {
    const result = await userController.createUserProfile(request, user.id);
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

export const POST = authMiddleware(userProfile);