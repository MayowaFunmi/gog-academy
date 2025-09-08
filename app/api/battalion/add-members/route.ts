import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { battalionController } from "@/backend/controller/battalion/battalion.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const addBattalionMembers = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const result = await battalionController.addBattalionMembers(request);
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

export const POST = authMiddleware(addBattalionMembers, ["SuperAdmin"]);
