import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextResponse } from "next/server";

const addWeek = async ({
  request,
}: {
  request: Request;
}): Promise<NextResponse> => {
  try {
    const result = await taskController.createWeek(request);
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

export const POST = authMiddleware(addWeek, ["SuperAdmin"]);
