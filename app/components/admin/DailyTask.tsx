"use client";

import { dailyTaskSchema } from "@/app/schemas/task/addTask";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../ui/input";
import { useAddDailyTask, useGetCohortTaskCategories } from "@/app/hooks/tasks";
import { fail_notify, success_notify } from "@/app/utils/constants";
import { AxiosError } from "axios";
import RichText from "../ui/RichText";
import {
  addHour,
  getDayEndTime,
  getDayStartTime,
} from "@/app/utils/formatDate";
import { capitalizeFirstLetter } from "@/app/utils/textTransform";
import Button from "../ui/button";
import { DailyTaskFormData, DailyTaskSchema } from "@/app/types/task";

interface DailyTaskProps {
  closeModal: () => void;
  cohortId: string;
  weekId: string;
  weekStart: string;
  // weekEnd: string;
}

const DailyTask = ({
  closeModal,
  cohortId,
  weekId,
  weekStart,
}: DailyTaskProps) => {
  const [content, setContent] = useState("");

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
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(dailyTaskSchema),
    defaultValues: {
      title: "",
      hourStart: 0,
      minuteStart: 0,
      hourEnd: 23,
      minuteEnd: 59,
      activated: false,
    },
  });

  const {
    data: taskCategories,
    isLoading: isLoadingTaskCategories,
    error: taskCategoriesError,
    isError: isTaskCategoriesError,
  } = useGetCohortTaskCategories(cohortId);

  const {
    mutate: addTask,
    data: taskData,
    isPending: addTaskPending,
    isSuccess: addTaskSuccess,
    isError: isAddTaskError,
    error: addTaskError,
  } = useAddDailyTask();

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  const onSubmit: SubmitHandler<DailyTaskSchema> = (data) => {
    const setStartTime = getDayStartTime(
      new Date(weekStart),
      data.dayOfWeek,
      data.hourStart || 0,
      data.minuteStart || 0
    );
    const setEndTime = getDayEndTime(
      new Date(weekStart),
      data.dayOfWeek,
      data.hourEnd || 23,
      data.minuteEnd || 59
    );

    const payload: DailyTaskFormData = {
      title: data.title,
      taskTypeId: data.taskTypeId,
      description: data.description,
      taskLink: data.taskLink,
      taskScriptures: data.taskScriptures,
      weekId: data.weekId,
      dayOfWeek: data.dayOfWeek + 1,
      startTime: addHour(setStartTime).toISOString(),
      endTime: addHour(setEndTime).toISOString(),
      activated: data.activated,
    };
    console.log(`data = ${JSON.stringify(payload, null, 2)}`);
    addTask(payload);
  };

  const selectedDay = watch("dayOfWeek");

  useEffect(() => {
    if (isTaskCategoriesError) {
      console.error("Error fetching task categories:", taskCategoriesError);
      const errMsg =
        (taskCategoriesError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [taskCategoriesError, isTaskCategoriesError]);

  useEffect(() => {
    if (isAddTaskError) {
      console.error("Error fetching task categories:", addTaskError);
      const errMsg =
        (addTaskError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [addTaskError, isAddTaskError]);

  useEffect(() => {
    if (content && weekId) {
      setValue("description", content);
      setValue("weekId", weekId);
    }
  }, [content, setValue, weekId]);

  useEffect(() => {
    if (addTaskSuccess && taskData && taskData.status === "success") {
      success_notify(taskData?.message);
      closeModal();
    }
  }, [addTaskSuccess, closeModal, taskData]);

  return (
    <div className="w-full flex flex-col justify-center mx-auto gap-3">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="taskTypeId"
            className="block text-sm font-medium text-gray-700"
          >
            Task Category
          </label>
          <select
            {...register("taskTypeId")}
            id="taskTypeId"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a category</option>
            {isLoadingTaskCategories && <option>Loading ...</option>}
            {taskCategories?.status === "success" &&
              taskCategories?.data?.map((category) => (
                <option key={category.id} value={category.id}>
                  {capitalizeFirstLetter(category.name)}
                </option>
              ))}
          </select>
          {errors.taskTypeId && (
            <p className="text-red-500 text-xs mt-1">
              {errors.taskTypeId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Input
            {...register("title")}
            type="text"
            id="title"
            autoComplete="title"
            required={false}
            placeholder="Enter task title if any"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <RichText
                  value={content}
                  setValue={handleContentChange}
                  onBlur={field.onBlur}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs">
                    {errors.description?.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div>
          <label
            htmlFor="dayOfWeek"
            className="block text-sm font-medium text-gray-700"
          >
            Select Week Day
          </label>
          <select
            {...register("dayOfWeek")}
            id="dayOfWeek"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Choose one</option>
            {weekDay.map((day, index) => (
              <option key={day} value={index}>
                {day}
              </option>
            ))}
          </select>
          {errors.dayOfWeek && (
            <p className="text-red-500 text-xs mt-1">
              {errors.dayOfWeek.message}
            </p>
          )}
        </div>

        {selectedDay && (
          <>
            <div>
              <p className="text-center font-semibold mb-2">
                Start hour and minute
              </p>
              <div className="w-full flex items-start justify-between space-x-2">
                <div className="w-1/2">
                  <label
                    htmlFor="hourStart"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Hour (12:00AM - 11:59PM)
                  </label>
                  <select
                    {...register("hourStart")}
                    id="hourStart"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour12 = i % 12 === 0 ? 12 : i % 12; // convert to 1–12 range
                      const ampm = i < 12 ? "AM" : "PM"; // determine AM or PM
                      return (
                        <option key={i} value={i}>
                          {`${hour12}:00 ${ampm}`}
                        </option>
                      );
                    })}
                  </select>
                  {errors.hourStart && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.hourStart.message}
                    </p>
                  )}
                </div>

                <div className="w-1/2">
                  <label
                    htmlFor="minuteStart"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Minute (0 - 60)
                  </label>
                  <select
                    {...register("minuteStart")}
                    id="minuteStart"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  {errors.minuteStart && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.minuteStart.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-center font-semibold mb-2">
                End hour and minute
              </p>
              <div className="w-full flex items-start justify-between space-x-2">
                <div className="w-1/2">
                  <label
                    htmlFor="hourEnd"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Hour (12:00AM - 11:59PM)
                  </label>
                  <select
                    {...register("hourEnd")}
                    id="hourEnd"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour12 = i % 12 === 0 ? 12 : i % 12; // convert to 1–12 range
                      const ampm = i < 12 ? "AM" : "PM"; // determine AM or PM
                      return (
                        <option key={i} value={i}>
                          {`${hour12}:00 ${ampm}`}
                        </option>
                      );
                    })}
                  </select>
                  {errors.hourEnd && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.hourEnd.message}
                    </p>
                  )}
                </div>

                <div className="w-1/2">
                  <label
                    htmlFor="minuteEnd"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Minute (0 - 60)
                  </label>
                  <select
                    {...register("minuteEnd")}
                    id="minuteEnd"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  {errors.minuteEnd && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.minuteEnd.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <label
            htmlFor="taskLink"
            className="block text-sm font-medium text-gray-700"
          >
            Add a link (if required)
          </label>
          <Input
            {...register("taskLink")}
            type="url"
            id="taskLink"
            autoComplete="taskLink"
            required={false}
            placeholder="https://www.google.com ..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {errors.taskLink && (
            <p className="text-red-500 text-xs mt-1">
              {errors.taskLink.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="taskScriptures"
            className="block text-sm font-medium text-gray-700"
          >
            Add scriptures (if required)
          </label>
          <Input
            {...register("taskScriptures")}
            type="text"
            id="taskScriptures"
            autoComplete="taskScriptures"
            required={false}
            placeholder="John 3:16, 2Corinthians 5:17 ..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>

        <div>
          <Controller
            name="activated"
            control={control}
            render={({ field }) => (
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Activate this task?
                </label>

                <div
                  onClick={() => field.onChange(!field.value)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    field.value ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      field.value ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
                {errors.activated && (
                  <p className="text-red-500 text-xs">
                    {errors.activated?.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="w-full bg-white my-5 p-4 rounded-lg shadow">
          <div className="text-center mb-3">
            <Button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              isLoading={addTaskPending}
              disabled={addTaskPending}
            >
              Create Task
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DailyTask;
