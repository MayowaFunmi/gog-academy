import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const approveSubmission = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    const result = await taskController.approveSubmission(request);
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
    console.error("Error adding task category:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred while adding task category...",
      },
      { status: 500 }
    );
  }
};

export const PATCH = authMiddleware(approveSubmission, ["SuperAdmin"]);