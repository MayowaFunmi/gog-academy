"use client";

import addTaskTypesSchema from "@/app/schemas/task/addTaskTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../ui/input";
import Button from "../ui/button";
import { TaskTypeFormData } from "@/app/types/task";
import { useAddTaskCategory } from "@/app/hooks/tasks";
import { AxiosError } from "axios";
import { fail_notify, success_notify } from "@/app/utils/constants";

interface AddTaskTypesProps {
  cohortId: string;
  closeModal: () => void;
}

const AddTaskTypes: React.FC<AddTaskTypesProps> = ({
  cohortId,
  closeModal,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(addTaskTypesSchema),
    defaultValues: {
      cohortId: cohortId,
      name: "",
    },
  });

  const {
    mutate: addTaskCategory,
    isPending,
    isError,
    error,
    isSuccess,
  } = useAddTaskCategory();

  const onSubmit: SubmitHandler<TaskTypeFormData> = (data) => {
    addTaskCategory(data);
  };

  useEffect(() => {
    if (isError) {
      console.error("Error adding task category:", error);
      const errorMsg = (error as AxiosError).response?.data?.message;
      fail_notify(`${errorMsg}` || "Error adding task category");
    } else if (isSuccess) {
      success_notify("Task category added successfully");
      closeModal();
    }
  }, [isError, error, isSuccess, closeModal]);

  return (
    <div className="w-full flex flex-col justify-center mx-auto gap-3">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="cohort"
            className="block text-sm font-medium text-gray-700"
          >
            Category Name
          </label>
          <Input
            {...register("name")}
            type="text"
            id="name"
            autoComplete="name"
            required
            placeholder="Enter category name"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="flex items-start justify-between">
          <label htmlFor="requiresAttendance">Requires Attendance: </label>
          <div>
            <Controller
              name="requiresAttendance"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div
                  onClick={() => onChange(!value)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    value ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      value ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex items-start justify-between">
          <label htmlFor="requiresSubmissions">Requires Submissions: </label>
          <div>
            <Controller
              name="requiresSubmissions"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div
                  onClick={() => onChange(!value)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    value ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      value ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              )}
            />
          </div>
        </div>
        {/* <div className="flex items-start justify-between">
          <label htmlFor="requiresMark">Requires Mark: </label>
          <div>
            <Controller
              name="requiresMark"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div
                  onClick={() => onChange(!value)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                    value ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      value ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </div>
              )}
            />
          </div>
        </div> */}
        <input type="hidden" {...register("cohortId")} value={cohortId} />
        <Button
          type="submit"
          className="w-1/2 bg-blue-500 text-white rounded-md p-2"
          isLoading={isPending}
          disabled={isPending}
        >
          Add Category
        </Button>
      </form>
    </div>
  );
};

export default AddTaskTypes;
