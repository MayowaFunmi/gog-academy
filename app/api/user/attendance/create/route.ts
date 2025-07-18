import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { attendanceController } from "@/backend/controller/attendance/attendance.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const markAttendance = async (
  request: NextRequest,
  context: { user: Promise<User> }
): Promise<NextResponse> => {
  try {
    const { id } = await context.user;
    const result = await attendanceController.markAttendance(request, id);
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

export const POST = authMiddleware(markAttendance, ["Student"])