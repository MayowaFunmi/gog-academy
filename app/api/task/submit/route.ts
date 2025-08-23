import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const config = {
  api: { bodyParser: false }
}

const submitTask = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const result = await taskController.submitTask(request);
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

export const POST = authMiddleware(submitTask, ["Student"])
