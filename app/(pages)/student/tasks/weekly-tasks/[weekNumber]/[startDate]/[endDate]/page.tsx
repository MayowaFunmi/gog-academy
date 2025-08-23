"use client";

import GetWeeklyTasks from "@/app/components/admin/GetWeeklyTasks";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function WeeklyTasksPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const cohortId = searchParams.get("cId") ?? "";
  const weekId = searchParams.get("wId") ?? "";

  // const weekNumber = Array.isArray(params.weekNumber)
  //   ? parseInt(params.weekNumber[0], 10)
  //   : parseInt(params.weekNumber as string, 10);
  const weekNumber = parseInt(params.weekNumber as string, 10);
  const startDate = useMemo(
    () => decodeURIComponent(params.startDate as string),
    [params.startDate]
  );
  const endDate = useMemo(
    () => decodeURIComponent(params.endDate as string),
    [params.endDate]
  );

  return (
    <div>
      <GetWeeklyTasks
        weekNumber={weekNumber}
        startDate={startDate}
        endDate={endDate}
        cohortId={cohortId}
        weekId={weekId}
      />
    </div>
  );
}
