import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { attendanceController } from "@/backend/controller/attendance/attendance.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const getUserDailyTaskAttendance = async (
  request: NextRequest,
  context: { user: Promise<User> }
): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId") ?? "";
    const { id } = await context.user;

    if (!taskId || !id) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "Task ID and User ID are required.",
        },
        {
          status: 400,
        }
      );
    }
    const result = await attendanceController.getDailyTaskAttendanceForUser(
      taskId,
      id
    );
    return NextResponse.json(
      {
        status: result.status,
        message: result.message,
        data: "data" in result ? result.data : null,
      },
      {
        status: mapHttpStatus(result.status),
      }
    );
  } catch (error) {
    console.error("Error fetching daily task attendance:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
};

export const GET = authMiddleware(getUserDailyTaskAttendance);
