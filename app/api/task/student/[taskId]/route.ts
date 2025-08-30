import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const studentTaskDetail = async (
  request: NextRequest,
    context: { params: Promise<{ taskId: string }> }
): Promise<NextResponse> => {
  try {
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
    const apiResponse = await taskController.getStudentTaskDetail(taskId)
    return NextResponse.json(apiResponse);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export const GET = authMiddleware(studentTaskDetail, ["Student"]);
