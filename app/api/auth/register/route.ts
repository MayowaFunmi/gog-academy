import { mapHttpStatus } from "@/app/utils/mapHttpPresponse";
import { userController } from "@/backend/controller/user.controller";
import { ApiResponse } from "@/backend/types/apiResponse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const result: ApiResponse = await userController.register(request);

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
