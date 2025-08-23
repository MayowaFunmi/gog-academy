"use client";

import { formatDateRange, removeHour } from "@/app/utils/formatDate";
import React, { useEffect, useState } from "react";
import Button from "../ui/button";
import DailyTask from "./DailyTask";
import Modal from "../ui/Modal";
import { useGetWeeklyTasks } from "@/app/hooks/tasks";
import { AxiosError } from "axios";
import { fail_notify } from "@/app/utils/constants";
import WeeklyTasks from "../tasks/WeeklyTasks";
import BackButton from "../ui/BackButton";
import { useSession } from "next-auth/react";

interface AdminWeeklyTasksProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
  cohortId: string;
  weekId: string;
}

const GetWeeklyTasks = ({
  weekNumber,
  startDate,
  endDate,
  cohortId,
  weekId,
}: AdminWeeklyTasksProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const role = session && session?.user?.roles[0];

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const {
    data: weeklyTasks,
    isLoading: tasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useGetWeeklyTasks(weekId);

  useEffect(() => {
    if (isTasksError) {
      console.error("Error fetching task categories:", tasksError);
      const errMsg =
        (tasksError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [tasksError, isTasksError]);

  return (
    <div className="mt-3 px-3">
      <div className="mb-3">
        <BackButton />
      </div>
      <div className="text-2xl font-semibold text-gray-800">
        Tasks for Week {weekNumber}
      </div>
      <div className="text-gray-600">
        {formatDateRange(new Date(startDate), removeHour(new Date(endDate)))}
      </div>

      {role && role === "SuperAdmin" && (
        <div className="w-full mt-5 text-gray-600 border border-t-2 border-t-blue-600 border-x-gray-300 border-b-gray-400 rounded-lg">
          <div className="w-full p-3 bg-white border-b border-b-gray-300">
            <div className="md:w-1/4 w-full flex items-center justify-center space-x-2 pb-2">
              <Button
                className="md:w-full w-1/2 rounded-md bg-pink-600 px-4 py-2 text-white font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                onClick={() => setIsOpen(true)}
              >
                Add new task
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="my-3">
        {tasksLoading && <p>Weekly tasks loading, please wait ...</p>}
        {weeklyTasks &&
        weeklyTasks.status === "success" &&
        weeklyTasks.data.length ? (
          <WeeklyTasks tasksResponse={weeklyTasks} role={role ?? ""} />
        ) : (
          <p>This week&apos;s tasks not found</p>
        )}
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          closeModal={handleCloseModal}
          title="Add New Task"
          widthClass="max-w-3xl"
        >
          <DailyTask
            closeModal={handleCloseModal}
            cohortId={cohortId}
            weekId={weekId}
            weekStart={startDate}
            // weekEnd={endDate}
          />
        </Modal>
      )}
    </div>
  );
};

export default GetWeeklyTasks;
