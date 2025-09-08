import { battalionController } from "@/backend/controller/battalion/battalion.module";
import { NextRequest, NextResponse } from "next/server";

const getBattalionByid = async (
  request: NextRequest
): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const cohortId = searchParams.get("cohortId") ?? "";
    const battalionId = searchParams.get("battalionId") ?? "";
    if (!cohortId || !battalionId) {
      return NextResponse.json(
        {
          status: "bad_request",
          message: "Cohort Id or Batallion Id cannot be empty",
        },
        { status: 500 }
      );
    }
    const apiResponse = await battalionController.getBattalionById(battalionId, cohortId);
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

export const GET = getBattalionByid