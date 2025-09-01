"use client";

import { useGetCurrentCohort } from "@/app/hooks/cohorts";
import { fail_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import PageLoader from "../loader/pageLoader";
import Select from "../ui/select";
import { useGetWeeklyReport } from "@/app/hooks/reports";

const WeeklyReport = () => {
  const [selectedWeek, setSelectedWeek] = useState<string>("");

  const {
    data: currentCohort,
    isLoading: isLoadingCurrentCohort,
    isSuccess: isSuccessCurrentCohort,
    isError: isErrorCurrentCohort,
    error: currentCohortError,
  } = useGetCurrentCohort();

  const {
    data: weeklyReportData,
    isLoading: isLoadingReport,
    // isSuccess: reportSuccess,
    isError: isReportError,
    error: reportError,
  } = useGetWeeklyReport(selectedWeek);

  useEffect(() => {
    if (isErrorCurrentCohort) {
      console.error("Error fetching cohorts:", currentCohortError);
      const errMsg =
        (currentCohortError as AxiosError).response?.data?.message ||
        "An error occurred while fetching cohorts.";
      fail_notify(errMsg);
    }

    if (currentCohort?.status === "notFound") {
      fail_notify("Current cohort not found");
    }
  }, [currentCohort?.status, currentCohortError, isErrorCurrentCohort]);

  useEffect(() => {
    if (isReportError) {
      console.error("Error fetching cohorts:", reportError);
      const errMsg =
        (reportError as AxiosError).response?.data?.message ||
        "An error occurred while fetching cohorts.";
      fail_notify(errMsg);
    }
  }, [reportError, isReportError]);

  return (
    <>
      {isLoadingCurrentCohort || isLoadingReport ? (
        <PageLoader />
      ) : (
        <div className="mt-3 px-3">
          <div className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <span>Weekly Report -</span>
            {isSuccessCurrentCohort && currentCohort && (
              <span className="text-gray-800 font-medium">
                {currentCohort?.data?.cohort} | Batch{" "}
                {currentCohort?.data?.batch}
              </span>
            )}
          </div>

          <div className="w-full mt-5 text-gray-600 border border-t-2 border-t-blue-600 border-x-gray-300 border-b-gray-400 rounded-lg">
            <div className="w-full p-3 bg-white border-b border-b-gray-300">
              <div className="md:w-1/2 w-full">
                <label className="font-normal text-sm">Select a week</label>
                <Select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select a week"
                >
                  <option value="" disabled>
                    Select a week
                  </option>
                  {currentCohort &&
                  currentCohort.status === "success" &&
                  currentCohort.data?.academicWeek ? (
                    currentCohort.data.academicWeek.map((week) => (
                      <option key={week.id} value={week.id}>
                        Week {week.weekNumber}
                      </option>
                    ))
                  ) : (
                    <option value="">Weeks not found</option>
                  )}
                </Select>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white text-center text-xl font-bold underline">
            Reports Table
          </div>

          {weeklyReportData?.data && weeklyReportData.status === "success" && (
            <div className="w-full overflow-x-auto bg-white">
              <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden text-sm md:text-base">
                {/* Table Head */}
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left sticky left-0 bg-gray-100 z-10">
                      Student
                    </th>
                    {weeklyReportData?.data.taskTypes.map((task) => (
                      <th
                        key={task}
                        className="p-3 text-center capitalize whitespace-nowrap"
                      >
                        {task}
                      </th>
                    ))}
                    <th className="p-3 text-center font-semibold">Total</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {weeklyReportData?.data?.report.map((row) => (
                    <tr
                      key={row.userId}
                      className="hover:bg-gray-50 transition-colors border-t"
                    >
                      {/* User Info */}
                      <td className="p-3 font-medium sticky left-0 bg-white z-10">
                        <div className="flex flex-col">
                          <span>{row.name}</span>
                          {row.matricNumber && (
                            <span className="text-xs text-gray-500">
                              {row.matricNumber}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Task Scores */}
                      {weeklyReportData?.data?.taskTypes.map((task) => (
                        <td key={task} className="p-3 text-center">
                          {row[task] ?? "-"}
                        </td>
                      ))}

                      {/* Total */}
                      <td className="p-3 text-center font-semibold">
                        {row.Total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WeeklyReport;
