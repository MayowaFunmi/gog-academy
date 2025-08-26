import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { taskController } from "@/backend/controller/task/task.module";
import { authMiddleware } from "@/backend/utils/authMiddleware";
import { NextRequest, NextResponse } from "next/server";

const getSubmissions = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);

  const weekId = searchParams.get("weekId");
  const pageParam = searchParams.get("page");
  const perPageParam = searchParams.get("perPage");

  if (!weekId) {
    return NextResponse.json(
      {
        status: "bad_request",
        message: "Week ID is required",
      },
      { status: 400 }
    );
  }

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const perPage = perPageParam ? parseInt(perPageParam, 10) : 10;

  const result = await taskController.getSubmissionApproval(
    weekId,
    page,
    perPage
  );

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

export const GET = authMiddleware(getSubmissions, ["SuperAdmin"])