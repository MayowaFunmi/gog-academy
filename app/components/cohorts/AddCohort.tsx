import React, { useEffect } from "react";
import Input from "../ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import addCohortSchema from "@/app/schemas/cohort/addCohort";
import Button from "../ui/button";
import { useAddCohort } from "@/app/hooks/cohorts";
import { CohortFormData } from "@/app/types/cohort";
import { AxiosError } from "axios";
import { fail_notify, success_notify } from "@/app/utils/constants";

interface AddCohortProps {
  closeModal: () => void;
}

const AddCohort = ({ closeModal }: AddCohortProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addCohortSchema),
  });

  const {
    mutate: addCohort,
    isPending: cohortCreating,
    isSuccess: cohortCreated,
    isError: isCohortError,
    error: cohortError,
  } = useAddCohort();

  const onSubmit: SubmitHandler<CohortFormData> = (data) => {
    const payload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    addCohort(payload);
  };

  useEffect(() => {
    if (isCohortError) {
      console.error("Error adding cohort:", cohortError);
      const errorMsg = (cohortError as AxiosError).response?.data?.message;
      // const errorMsg2 = (error as AxiosError).response?.data?.data?.map((x: any) => x.message);
      fail_notify(`${errorMsg}` || "Error adding cohort");
    } else if (cohortCreated) {
      success_notify("Cohort added successfully");
      closeModal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCohortError, cohortError, cohortCreated]);

  return (
    <div className="w-full flex flex-col justify-center mx-auto gap-3">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="cohort"
            className="block text-sm font-medium text-gray-700"
          >
            Cohort Name
          </label>
          <Input
            {...register("cohort")}
            type="text"
            id="cohort"
            autoComplete="cohort"
            required
            placeholder="Enter your username"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {errors.cohort && (
            <p className="text-red-500 text-xs mt-1">{errors.cohort.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="batch"
            className="block text-sm font-medium text-gray-700"
          >
            Batch
          </label>
          <Input
            {...register("batch")}
            type="text"
            id="batch"
            autoComplete="batch"
            required
            placeholder="Enter your batch"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {errors.batch && (
            <p className="text-red-500 text-xs mt-1">{errors.batch.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <Input
            {...register("startDate")}
            type="date"
            id="startDate"
            autoComplete="startDate"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <Input
            {...register("endDate")}
            type="date"
            id="endDate"
            autoComplete="endDate"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>

        <div>
          <Button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2"
            isLoading={cohortCreating}
            disabled={cohortCreating}
          >
            Create Cohort
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCohort;
