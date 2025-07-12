import { prisma } from "@/lib/prisma";
import { ApiResponse } from "../types/apiResponse";

export function slugify(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, "-");
}

export async function generateCohortSlug(
  cohortName: string,
  batch: string
): Promise<ApiResponse> {
  try {
    const baseSlug = cohortName.trim().toLowerCase().replace(/\s+/g, "-");
    const slug = `${baseSlug}-batch-${batch.trim().toLowerCase()}`;
    const existing = await prisma.academyCohort.findUnique({
      where: { slug },
    });
    if (existing) {
      return {
        status: "conflict",
        message: "",
      };
    }

    return {
      status: "success",
      message: "",
      data: slug,
    };
  } catch (error) {
    console.error("Error logging in user:", error);
    return {
      status: "error",
      message: "An unexpected error occurred",
    };
  }
}
