import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { userController } from "@/backend/controller/user/user.module";
import { ApiResponse } from "@/backend/types/apiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const result: ApiResponse = await userController.login(request);

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
}
