import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { userController } from "@/backend/controller/user/user.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const getAllUsers = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "10", 10)
  const result = await userController.getAllUsers(page, limit)
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
}

export const GET = authMiddleware(getAllUsers, ["SuperAdmin"])