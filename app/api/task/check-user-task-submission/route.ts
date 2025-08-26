import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const getUserTaskSubmission = async (
  request: NextRequest,
  context: { user: Promise<User> }
): Promise<NextResponse> => {
  try {
    const { id } = await context.user
    const { searchParams } = new URL(request.url);

    const taskId = searchParams.get("taskId") ?? ""
    if (!taskId && !id) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "Missing user ID and/or task ID",
        },
        { status: 400 }
      );
    }
    const result = await taskController.getUserSubmissions(id, taskId);
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
    console.error("Error adding daily task:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred while adding daily task...",
      },
      { status: 500 }
    );
  }
};

export const GET = authMiddleware(getUserTaskSubmission)