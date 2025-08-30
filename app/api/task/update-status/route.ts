import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const updateTaskActivation = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    const apiResponse = await taskController.updateTaskActivation(request);
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
