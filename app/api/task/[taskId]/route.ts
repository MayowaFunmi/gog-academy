import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const taskById = async (
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
    const { searchParams } = new URL(request.url);
    const attendancePageParam = searchParams.get("attendancePage")
    const attendancePageSizeParam = searchParams.get("attendancePageSize")
    const submissionPageParam = searchParams.get("submissionPage")
    const submissionPageSizeParam = searchParams.get("submissionPageSize")

    const attendancePage = attendancePageParam ? parseInt(attendancePageParam, 10) : 1;
    const attendancePageSize = attendancePageSizeParam ? parseInt(attendancePageSizeParam, 10) : 10;
    const submissionPage = submissionPageParam ? parseInt(submissionPageParam, 10) : 1;
    const submissionPageSize = submissionPageSizeParam ? parseInt(submissionPageSizeParam, 10) : 10;

    const apiResponse = await taskController.getTaskDetail(
      taskId,
      attendancePage,
      attendancePageSize,
      submissionPage,
      submissionPageSize
    );
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
};

export const GET = authMiddleware(taskById, ["SuperAdmin"]);
