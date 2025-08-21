"use client";

import { useGetTaskById } from "@/app/hooks/tasks";
import React, { useEffect } from "react";
import PageLoader from "../loader/pageLoader";
import BackButton from "../ui/BackButton";
import moment from "moment";
import { fail_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import { useGetActiveUsers } from "@/app/hooks/auth";
import SmallLoader from "../loader/SmallLoader";
import Link from "next/link";
import DOMPurify from "dompurify";

interface DailyTaskProps {
  taskId: string;
}

const TaskDetail = ({ taskId }: DailyTaskProps) => {
  const weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const {
    data: task,
    isLoading: taskLoading,
    isError: taskIsError,
    error: taskError,
  } = useGetTaskById(taskId);

  const {
    data: activeUsers,
    isLoading: usersLoading,
    isError: isUsersError,
    isSuccess: usersSuccess,
    error: usersError,
  } = useGetActiveUsers();

  useEffect(() => {
    if (taskIsError) {
      console.error("Error fetching task categories:", taskError);
      const errMsg =
        (taskError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [taskError, taskIsError]);

  useEffect(() => {
    if (isUsersError) {
      console.error("Error fetching task categories:", usersError);
      const errMsg =
        (usersError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [usersError, isUsersError]);

  return (
    <main className="w-full mt-3 px-3">
      <div className="mb-3">
        <BackButton />
      </div>

      <div className="flex justify-center space-x-2">
        <div className="w-1/2 mx-auto">
          {taskLoading ? (
            <PageLoader />
          ) : (
            task?.status === "success" &&
            task?.data && (
              <>
                <div className="text-2xl font-semibold text-gray-800">
                  Tasks for {weekDay[task.data.dayOfWeek - 1]}
                </div>
                <p className="text-gray-600 mb-4">{task.data.taskType?.name}</p>

                <div
                  className="prose prose-sm mb-4"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(task.data.description) }}
                />

                {task.data.taskScriptures && (
                  <p className="text-sm italic text-gray-500 mb-2">
                    Scriptures: {task.data.taskScriptures}
                  </p>
                )}

                <p className="text-sm text-gray-700 mb-1">
                  Start:{" "}
                  {moment(task.data.startTime)
                    .format("dddd MMMM D, YYYY h:mma")
                    .toUpperCase()}
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  End:{" "}
                  {moment(task.data.endTime)
                    .format("dddd MMMM D, YYYY h:mma")
                    .toUpperCase()}
                </p>

                {task.data.taskLink && (
                  <Link
                    href={task.data.taskLink.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    Open Task Link
                  </Link>
                )}
              </>
            )
          )}
        </div>

        <div className="w-1/2">
          <div className="text-2xl font-semibold text-gray-800">
            Active Users
          </div>

          {usersLoading && <SmallLoader />}
          <div className="flex flex-wrap gap-6">
            {activeUsers?.status === "success" &&
            activeUsers?.data &&
            usersSuccess ? (
              activeUsers.data.map((user) => (
                <div key={user.id} className="flex flex-col items-center">
                  {/* Avatar Circle */}
                  <div className="w-14 h-14 rounded-full border-pink-400 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <span className="text-lg font-bold text-gray-600">
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Name below */}
                  <p className="text-sm font-medium mt-1">{user.firstName}</p>
                  <p className="text-xs text-gray-500">{user.lastName}</p>
                </div>
              ))
            ) : (
              <p>No active user</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TaskDetail;
