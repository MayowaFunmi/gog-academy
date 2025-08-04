"use client";

import { useGetAllCohorts, useGetCohortById } from "@/app/hooks/cohorts";
import { fail_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import Select from "../ui/select";
import FullCalendar from "@fullcalendar/react";
import { AcademicWeek } from "@/app/types/cohort";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { startOfDay, isWithinInterval, startOfMonth, endOfMonth, getMonth, getYear, differenceInMonths, addMonths } from "date-fns";
import { useRouter } from "next/navigation";

const TaskDashboard = () => {
  const router = useRouter();
  const [selectedCohortId, setSelectedCohortId] = useState<string>("");
  const calendarRef = useRef<FullCalendar>(null);
  const [weeks, setWeeks] = useState<AcademicWeek[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<AcademicWeek | null>(null);

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

  const handleWeekClick = (week: AcademicWeek) => {
    setSelectedWeek(week);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(new Date(week.startDate));
    }
  };

  const renderWeekNumbers = () => {
    if (!selectedCohortId || !weeks.length) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {weeks.map((week) => (
          <button
            key={week.id}
            onClick={() => handleWeekClick(week)}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedWeek?.id === week.id
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-blue-100"
            }`}
          >
            Week {week.weekNumber}
          </button>
        ))}
      </div>
    );
  };

  const renderDayCellContent = (arg: { date: Date }) => {
    if (selectedCohort?.status !== "success" || !selectedCohort?.data) {
      return <span className="text-gray-300 text-xs">{arg.date.getDate()}</span>;
    }
    const cohortStart = startOfDay(new Date(selectedCohort?.data?.startDate));
    const cohortEnd = startOfDay(new Date(selectedCohort?.data?.endDate));

    // Always show the date, but style based on cohort range
    if (!isWithinInterval(arg.date, { start: cohortStart, end: cohortEnd })) {
      return <span className="text-gray-300 text-xs">{arg.date.getDate()}</span>;
    }

    if (selectedWeek) {
      const weekStart = startOfDay(new Date(selectedWeek.startDate));
      const weekEnd = startOfDay(new Date(selectedWeek.endDate));
      return (
        <span
          className={
            isWithinInterval(arg.date, { start: weekStart, end: weekEnd })
              ? "text-blue-800 font-semibold text-xs"
              : "text-gray-400 text-xs"
          }
        >
          {arg.date.getDate()}
        </span>
      );
    }

    return (
      <span className="text-blue-800 font-semibold text-xs">{arg.date.getDate()}</span>
    );
  };

  const handleDateClick = (arg: { date: Date }) => {
    if (selectedCohort?.status !== "success" || !selectedCohort?.data) return;

    const cohortStart = startOfDay(new Date(selectedCohort?.data?.startDate));
    const cohortEnd = startOfDay(new Date(selectedCohort?.data?.endDate));
    if (isWithinInterval(arg.date, { start: cohortStart, end: cohortEnd })) {
      router.push(`/admin/tasks/${selectedCohortId}/${arg.date.toISOString()}`);
    }
  };

  useEffect(() => {
    if (
      selectedCohort?.status === "success" &&
      selectedCohort?.data?.academicWeek
    ) {
      setWeeks(selectedCohort?.data?.academicWeek);
    }
    if (selectedCohort?.status === "success" && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(new Date(selectedCohort?.data?.startDate));
    }
  }, [selectedCohort]);

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

  // Calculate visible months based on cohort start and end dates
  const getVisibleMonths = () => {
    if (selectedCohort?.status !== "success" || !selectedCohort?.data) {
      return [];
    }
    const startDate = new Date(selectedCohort.data.startDate);
    const endDate = new Date(selectedCohort.data.endDate);
    const startMonth = startOfMonth(startDate);
    const endMonth = endOfMonth(endDate);
    const months = [];
    let currentMonth = startMonth;
    while (currentMonth <= endMonth) {
      months.push(currentMonth);
      currentMonth = addMonths(currentMonth, 1);
    }
    return months;
  };

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
      <div className="my-5 bg-white p-3">{renderWeekNumbers()}</div>

      {selectedCohort?.status === "success" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <FullCalendar
            ref={calendarRef}
            plugins={[multiMonthPlugin, dayGridPlugin, interactionPlugin]}
            initialView="multiMonthYear"
            multiMonthMaxColumns={3}
            multiMonthMinWidth={250} // Reduced width
            dayCellContent={renderDayCellContent}
            dateClick={handleDateClick}
            validRange={{
              start: new Date(selectedCohort?.data?.startDate),
              end: new Date(selectedCohort?.data?.endDate),
            }}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "",
            }}
            height="auto"
            dayMaxEvents={false}
            datesSet={(arg) => {
              // Ensure only cohort months are shown
              const cohortStart = new Date(selectedCohort?.data?.startDate);
              const cohortEnd = new Date(selectedCohort?.data?.endDate);
              const viewStart = startOfMonth(arg.start);
              const viewEnd = endOfMonth(arg.end);
              const cohortStartMonth = startOfMonth(cohortStart);
              const cohortEndMonth = endOfMonth(cohortEnd);
              if (viewStart < cohortStartMonth || viewEnd > cohortEndMonth) {
                if (calendarRef.current) {
                  const calendarApi = calendarRef.current.getApi();
                  calendarApi.gotoDate(cohortStart);
                }
              }
            }}
            dayCellClassNames={(arg) => {
              if (selectedCohort?.status !== "success" || !selectedCohort?.data) {
                return ["bg-gray-100", "text-xs"];
              }
              const cohortStart = startOfDay(new Date(selectedCohort?.data?.startDate));
              const cohortEnd = startOfDay(new Date(selectedCohort?.data?.endDate));

              // Always show the cell, style based on cohort range
              if (!isWithinInterval(arg.date, { start: cohortStart, end: cohortEnd })) {
                return ["bg-red-100", "text-red-300", "text-xs"];
              }
              if (selectedWeek) {
                const weekStart = startOfDay(new Date(selectedWeek.startDate));
                const weekEnd = startOfDay(new Date(selectedWeek.endDate));
                return isWithinInterval(arg.date, { start: weekStart, end: weekEnd })
                  ? ["bg-blue-100", "text-xs"]
                  : ["bg-blue-50", "opacity-50", "text-xs"];
              }
              return ["bg-blue-50", "text-xs"];
            }}
            views={{
              multiMonthYear: {
                multiMonthMinWidth: 250, // Reduced width per month
                duration: {
                  months: differenceInMonths(
                    new Date(selectedCohort?.data?.endDate),
                    new Date(selectedCohort?.data?.startDate)
                  ) + 1,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;