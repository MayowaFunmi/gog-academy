"use client";

import { WeeklyTasksResponse } from "@/app/types/task";
import Link from "next/link";
import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import { capitalizeFirstLetter } from "@/app/utils/textTransform";
import { useUpdateTaskStatus } from "@/app/hooks/tasks";
import { AxiosError } from "axios";
import { fail_notify, success_notify } from "@/app/utils/constants";
import PageLoader from "../loader/pageLoader";
import moment from "moment";

interface WeeklyTasksProps {
  tasksResponse: WeeklyTasksResponse;
  role: string;
}

const WeeklyTasks = ({ tasksResponse, role }: WeeklyTasksProps) => {
  const {
    mutate: updateTask,
    data: updateData,
    isSuccess: updateSuccess,
    isPending: updatePending,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateTaskStatus();

  const handleUpdateClick = (taskId: string) => {
    if (!taskId) return;
    updateTask(taskId);
  };

  const showResponse = role && role === "Student" ? tasksResponse.data?.filter((task) => task.activated) : tasksResponse.data;

  useEffect(() => {
    if (isUpdateError) {
      console.error("Error fetching task categories:", updateError);
      const errMsg =
        (updateError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [updateError, isUpdateError]);

  useEffect(() => {
    if (updateSuccess && updateData && updateData.status === "success") {
      success_notify(updateData.message);
    }
  }, [updateData, updateSuccess]);

  return (
    <>
      {updatePending ? (
        <PageLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* <div></div> */}
          {showResponse.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between border border-gray-200"
            >
              <div>
                <h2 className="text-lg font-semibold mb-1">
                  {capitalizeFirstLetter(task.title)}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {task.taskType?.name &&
                    capitalizeFirstLetter(task.taskType?.name)}
                </p>
                <div
                  className="prose prose-sm mb-2"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(task.description),
                  }}
                />
                {task.taskScriptures && (
                  <p className="text-xs text-gray-600 italic mb-2">
                    Scriptures: {task.taskScriptures}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Start:{" "}
                  {moment(task.startTime).format("dddd MMMM D, YYYY h:mma")}
                </p>
                <p className="text-xs text-gray-500">
                  End:{" "}
                  {moment(task.endTime).format("dddd MMMM D, YYYY h:mma")}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center gap-2">
                <Link
                  href={`/${role === "SuperAdmin" ? "admin" : "student"}/tasks/${task.id}?wkId=${task.weekId}`}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition"
                >
                  View Details
                </Link>
                {task.taskLink && (
                  <a
                    href={task.taskLink.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition"
                  >
                    Open Link
                  </a>
                )}
                {role === "SuperAdmin" && (
                  <div
                    onClick={() => handleUpdateClick(task.id)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      task.activated ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        task.activated ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WeeklyTasks;
