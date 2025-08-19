import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const weeklyTasks = async (
  request: NextRequest,
  context: { params: Promise<{ weekId: string }> }
): Promise<NextResponse> => {
  try {
    const { weekId } = await context.params;
    if (!weekId) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "Week Id cannot be empty",
        },
        { status: 500 }
      );
    }
    const apiResponse = await taskController.getWeeklyTasks(weekId);
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

export const GET = authMiddleware(weeklyTasks);
