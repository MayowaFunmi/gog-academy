import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { cohortController } from "@/backend/controller/cohort/cohort.module";
import { NextResponse } from "next/server";

const activeCohort = async (): Promise<NextResponse> => {
  try {
    const result = await cohortController.getCurrentCohort();
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

export const GET = activeCohort;