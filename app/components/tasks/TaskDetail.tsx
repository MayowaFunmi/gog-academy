"use client";

import { useGetTaskById, useGetUserTaskSubmission } from "@/app/hooks/tasks";
import React, { useEffect, useState } from "react";
import PageLoader from "../loader/pageLoader";
import BackButton from "../ui/BackButton";
import moment from "moment";
import { fail_notify, success_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import { useGetActiveUsers } from "@/app/hooks/auth";
import SmallLoader from "../loader/SmallLoader";
import Link from "next/link";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import Modal from "../ui/Modal";
import SubmitDailyTask from "../student/SubmitDailyTask";
import {
  useGetUserDailyTaskAttendance,
  useMarkTaskAttendance,
} from "@/app/hooks/attendance";
import Button from "../ui/button";
import AdminTaskTables from "../admin/AdminTaskTables";

interface DailyTaskProps {
  taskId: string;
  weekId: string;
}

const TaskDetail = ({ taskId, weekId }: DailyTaskProps) => {
  const { data: session } = useSession();
  const userSession = session && session?.user;
  const role = userSession?.roles[0] ?? "";
  const userId = userSession?.id;
  const [isOpen, setIsOpen] = useState(false);
  const [attendancePage, setAttendancePage] = useState<string>("1")
  const [attendancePageSize, setAttendancePageSize] = useState<string>("10")
  const [submissionPage, setSubmissionPage] = useState<string>("1")
  const [submissionPageSize, setSubmissionPageSize] = useState<string>("10")

  const handleCloseModal = () => {
    setIsOpen(false);
  };

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
  } = useGetTaskById(taskId, role, attendancePage, attendancePageSize, submissionPage, submissionPageSize);

  const {
    data: activeUsers,
    isLoading: usersLoading,
    isError: isUsersError,
    isSuccess: usersSuccess,
    error: usersError,
  } = useGetActiveUsers();

  const {
    data: userTaskSubmission,
    isError: isUserTaskError,
    error: userTaskError,
  } = useGetUserTaskSubmission(taskId);

  const {
    data: userAttendance,
    isLoading: userAttendanceLoading,
    isError: isUserAttendanceError,
    error: userAttendanceError,
  } = useGetUserDailyTaskAttendance(taskId);

  const {
    mutate: markAttendance,
    isPending: attendancePending,
    isSuccess: isAttendanceSuccess,
    // data: attendanceResponse,
    isError: isAttendanceError,
    error: attendanceError,
  } = useMarkTaskAttendance();

  const handleMarkAttendance = (taskDate: string) => {
    markAttendance({ taskId, taskDate });
  };

  const onAttendancePageChange = (p: number) => setAttendancePage(String(p));
  const onAttendancePageSizeChange = (s: number) => {
    setAttendancePageSize(String(s));
    setAttendancePage("1");
  };
  const onSubmissionsPageChange = (p: number) => setSubmissionPage(String(p));
  const onSubmissionsPageSizeChange = (s: number) => {
    setSubmissionPageSize(String(s));
    setSubmissionPage("1");
  };

  useEffect(() => {
    if (isAttendanceSuccess) {
      success_notify("Attendance marked successfully");
    }
  }, [isAttendanceSuccess]);

  useEffect(() => {
    if (isAttendanceError) {
      console.error("Error fetching task categories:", attendanceError);
      const errMsg =
        (attendanceError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [attendanceError, isAttendanceError]);

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

  useEffect(() => {
    if (isUserTaskError) {
      console.error("Error fetching task categories:", userTaskError);
      const errMsg =
        (userTaskError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [userTaskError, isUserTaskError]);

  useEffect(() => {
    if (isUserAttendanceError) {
      console.error("Error fetching task categories:", userAttendanceError);
      const errMsg =
        (userAttendanceError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [userAttendanceError, isUserAttendanceError]);

  return (
    <main className="w-full mt-3 px-3">
      <div className="mb-3">
        <BackButton />
      </div>

      <div className="w-full flex justify-center gap-3">
        <div className="w-1/2 mx-auto bg-white shadow-md rounded-lg p-3">
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
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(task.data.description),
                  }}
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

                <div className="flex items-start justify-between">
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

                  {role && role === "Student" && (
                    <>
                      {task.data?.taskType?.requiresSubmissions && (
                        <Button
                          className={`px-4 py-2 text-white rounded-lg  transition 
                            ${userTaskSubmission?.data ||
                              new Date() < new Date(task.data.startTime)
                              ? "bg-gray-500 opacity-50 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                            }`}
                          onClick={() => setIsOpen(true)}
                          disabled={
                            userTaskSubmission?.data ||
                            new Date() < new Date(task.data.startTime)
                          }
                        >
                          {userTaskSubmission?.data
                            ? "Submitted"
                            : new Date() < new Date(task.data.startTime)
                              ? "Task not opened"
                              : "Submit"}
                        </Button>
                      )}

                      {/* use checks for attendance */}
                      {task.data?.taskType?.requiresAttendance && (
                        <Button
                          className={`px-4 py-2 text-white rounded-lg  transition 
                            ${userAttendance?.data ||
                              new Date() < new Date(task.data.startTime)
                              ? "bg-gray-500 opacity-50 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                            }`}
                          onClick={() =>
                            handleMarkAttendance(task.data?.startTime)
                          }
                          disabled={
                            userAttendance?.data ||
                            new Date() < new Date(task.data.startTime)
                          }
                          isLoading={attendancePending || userAttendanceLoading}
                        >
                          {userAttendance?.data
                            ? "Marked"
                            : new Date() < new Date(task.data.startTime)
                              ? "Attendance not opened"
                              : "Mark Attendance"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </>
            )
          )}
        </div>

        <div className="w-1/2 mx-auto bg-white shadow-md rounded-lg p-3">
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

      {role === "SuperAdmin" && task?.status === "success" && task?.data && (
        <div className="mt-8">
          <AdminTaskTables
            role={role}
            task={task.data}
            attendanceMeta={task.data.attendanceMeta}
            submissionsMeta={task.data.submissionsMeta}
            onAttendancePageChange={onAttendancePageChange}
            onAttendancePageSizeChange={onAttendancePageSizeChange}
            onSubmissionsPageChange={onSubmissionsPageChange}
            onSubmissionsPageSizeChange={onSubmissionsPageSizeChange}
          />
        </div>
      )}

      {isOpen && (
        <Modal
          isOpen={isOpen}
          closeModal={handleCloseModal}
          title="Submit Daily Task"
          widthClass="max-w-3xl"
        >
          <SubmitDailyTask
            userId={userId ?? ""}
            taskId={taskId}
            weekId={weekId}
            closeModal={handleCloseModal}
          />
        </Modal>
      )}
    </main>
  );
};

export default TaskDetail;
