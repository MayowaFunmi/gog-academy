import { reportController } from "@/backend/controller/report/report.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const weeklyReport = async (
  request: NextRequest,
    context: { params: Promise<{ weekId: string }> }
): Promise<NextResponse> => {
  try {
    const { weekId } = await context.params
    if (!weekId) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "Week Id cannot be empty",
        },
        { status: 500 }
      );
    }

    const apiResponse = await reportController.generateWeeklyTask(weekId)
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

export const GET = authMiddleware(weeklyReport, ["SuperAdmin"])