import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const updateTaskActivation = async (
  request: NextRequest,
  context: { params: Promise<{ taskId: string }> }
): Promise<NextResponse> => {
  try {
    // const taskId = context.params.taskId;
    const { taskId } = await context.params;
    if (!taskId) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "Task Id cannot be empty",
        },
        { status: 500 }
      );
    }
    const apiResponse = await taskController.updateTaskActivation(taskId);
    return NextResponse.json(apiResponse);
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

export const PATCH = authMiddleware(updateTaskActivation, ["SuperAdmin"]);
