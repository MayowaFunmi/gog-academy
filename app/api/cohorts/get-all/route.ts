import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { cohortController } from "@/backend/controller/cohort/cohort.module";
import { NextRequest, NextResponse } from "next/server";

const getAllCohorts = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const result = await cohortController.getAllCohorts(page, limit);
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
};

export const GET = getAllCohorts