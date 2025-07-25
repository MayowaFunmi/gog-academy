import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { cohortController } from "@/backend/controller/cohort/cohort.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const addCohort = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const result = await cohortController.createCohort(request);
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

export const POST = authMiddleware(addCohort, ["SuperAdmin"]);
