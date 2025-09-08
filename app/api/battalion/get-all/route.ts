import { battalionController } from "@/backend/controller/battalion/battalion.module";
import { NextRequest, NextResponse } from "next/server";

const getAllBattalions = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get("cohortId") ?? "";
    if (!cohortId) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "Cohort Id cannot be empty",
        },
        { status: 500 }
      );
    }
    const apiResponse = await battalionController.getAllBattalions(cohortId);
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

export const GET = getAllBattalions;
