import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { taskController } from "@/backend/controller/task/task.module";
import { NextRequest, NextResponse } from "next/server";

const getAllTaskTypes = async (
  request: NextRequest,
  context: { params: Promise<{ cohortId: string }> }
): Promise<NextResponse> => {
  try {
    const { cohortId } = await context.params;
    const result = await taskController.getTaskTypes(cohortId);
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

export const GET = getAllTaskTypes;
