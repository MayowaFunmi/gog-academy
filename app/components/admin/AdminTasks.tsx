"use client";

import React, { useEffect, useState } from "react";
import { CalendarRangeSplit } from "../calendar/CalendarRangeSplit";
import { WeekRange } from "@/app/types/calendar";
import { generateWeekRanges } from "@/app/utils/calendarGenerator/calendarRange";
import { useGetAllCohorts, useGetCohortById } from "@/app/hooks/cohorts";
import Select from "../ui/select";
import { fail_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import { formatDateRange } from "@/app/utils/formatDate";
import Button from "../ui/button";
import { useRouter } from "next/navigation";

const AdminTasks = () => {
  const [selectedCohortId, setSelectedCohortId] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<WeekRange | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    data: cohorts,
    isError: isCohortsError,
    error: cohortsError,
  } = useGetAllCohorts();

  const {
    data: selectedCohort,
    isError: isSelectedCohortError,
    error: selectedCohortError,
  } = useGetCohortById(selectedCohortId);

  const handleCohortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCohortId(event.target.value);
    setSelectedWeek(null);
  };

  const handleGoToWeeklyTasks = (
    weekNumber: number,
    startDate: string,
    endDate: string,
    weekId: string
  ) => {
    setLoading(true);
    router.push(
      `/admin/tasks/weekly-tasks/${weekNumber}/${startDate}/${endDate}?cId=${selectedCohortId}&wId=${weekId}`
    );
  };

  const renderWeekNumbers = () => {
    if (selectedCohort?.status !== "success" || !selectedCohort?.data) {
      return <p>No weeks available</p>;
    }

    const weeks = generateWeekRanges(
      new Date(selectedCohort.data.startDate),
      new Date(selectedCohort.data.endDate)
    );
    return (
      <div>
        <p className="text-lg font-semibold mb-2 text-center">Choose a week to create task</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {weeks?.length === 0 && <p>Weeks not found</p>}
          {weeks.map((week) => (
            <button
              key={week.index}
              onClick={() => setSelectedWeek(week)}
              className={`px-3 py-1 text-sm rounded-md border
              ${
                selectedWeek?.index === week.index
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-blue-100 hover:cursor-pointer"
              }
            `}
            >
              Week {week.index}
            </button>
          ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isCohortsError) {
      console.error("Error fetching cohorts:", cohortsError);
      const errMsg =
        (cohortsError as AxiosError).response?.data?.message ||
        "An error occurred while fetching cohorts.";
      fail_notify(errMsg);
    }
  }, [cohortsError, isCohortsError]);

  useEffect(() => {
    if (isSelectedCohortError) {
      console.error("Error fetching selected cohort:", selectedCohortError);
      const errMsg =
        (selectedCohortError as AxiosError).response?.data?.message ||
        "An error occurred while fetching the selected cohort.";
      fail_notify(errMsg);
    }
  }, [selectedCohortError, isSelectedCohortError]);

  return (
    <div className="mt-3 px-3">
      <div className="text-2xl font-semibold text-gray-800">Tasks</div>
      <div className="w-full mt-5 text-gray-600 border border-t-2 border-t-blue-600 border-x-gray-300 border-b-gray-400 rounded-lg">
        <div className="w-full p-3 bg-white border-b border-b-gray-300">
          <div className="md:w-1/2 w-full">
            <label className="font-normal text-sm">Select a cohort</label>
            <Select
              value={selectedCohortId}
              onChange={handleCohortChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Select a cohort"
            >
              <option value="" disabled>
                Select a cohort
              </option>
              {cohorts?.data?.cohorts?.map((cohort) => (
                <option key={cohort.id} value={cohort.id}>
                  {cohort.cohort} Batch {cohort.batch}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      <div className="my-5 bg-white p-4 rounded-lg shadow">
        <div className="text-center mb-3">
          <h3 className="text-lg font-semibold mb-2">Cohort Task Categories</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedCohort?.status === "success" && (
              <>
                {selectedCohort?.data?.taskTypes &&
                selectedCohort.data.taskTypes.length > 0 ? (
                  selectedCohort.data.taskTypes.map((task) => (
                    <button
                      key={task.id}
                      className={`px-3 py-2 text-sm rounded-md border hover:bg-blue-100 hover:cursor-pointer`}
                    >
                      {task.name}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">
                    No task Categories found for this cohort.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="my-5 bg-white p-3">{renderWeekNumbers()}</div>

      {selectedCohort?.status === "success" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center mb-3">
            <h3 className="text-lg font-semibold mb-2">Cohort Calendar</h3>
            <p className="text-sm text-gray-600">
              {formatDateRange(
                new Date(selectedCohort.data.startDate),
                new Date(selectedCohort.data.endDate)
              )}
            </p>
          </div>

          <CalendarRangeSplit
            startDate={new Date(selectedCohort.data.startDate)}
            endDate={new Date(selectedCohort.data.endDate)}
            selectedWeekRange={selectedWeek}
          />
        </div>
      )}

      {selectedWeek && selectedCohort?.data?.academicWeek && (
        <div className="w-full bg-white my-5 p-4 rounded-lg shadow">
          <div className="text-center mb-3">
            <Button
              onClick={() =>
                handleGoToWeeklyTasks(
                  selectedCohort?.data?.academicWeek?.[selectedWeek?.index - 1]
                    ?.weekNumber ?? 0,
                  selectedCohort?.data?.academicWeek?.[selectedWeek?.index - 1]
                    ?.startDate ?? "",
                  selectedCohort?.data?.academicWeek?.[selectedWeek?.index - 1]
                    ?.endDate ?? "",
                  selectedCohort?.data?.academicWeek?.[selectedWeek?.index - 1]
                    ?.id ?? ""
                )
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              isLoading={loading}
              disabled={loading}
            >
              View Week {selectedWeek.index} Tasks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
