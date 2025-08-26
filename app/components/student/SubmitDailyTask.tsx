"use client";

import { createTaskSubmissionSchema } from "@/app/schemas/task/submitDailyTaskSchema";
// import { CreateTaskSubmissionInput } from "@/app/types/task";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import RichText from "../ui/RichText";
import Button from "../ui/button";
import { useTaskSubmit } from "@/app/hooks/tasks";
import { AxiosError } from "axios";
import { fail_notify, success_notify } from "@/app/utils/constants";
import { FaPlus, FaTrash } from "react-icons/fa";
import { CreateTaskSubmissionInput } from "@/app/types/task";

interface SubmitProps {
  userId: string;
  taskId: string;
  weekId: string;
  closeModal: () => void;
}

const SubmitDailyTask = ({
  userId,
  taskId,
  weekId,
  closeModal,
}: SubmitProps) => {
  const {
    mutate: submitTask,
    isPending: submitPending,
    isError: isSubmitError,
    error: submitError,
    isSuccess: submitSuccess,
  } = useTaskSubmit();

  const {
    handleSubmit,
    control,
    register,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createTaskSubmissionSchema),
    // defaultValues: {
    //   submission: "",
    //   screenshots: [{ file: undefined }],
    // },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "screenshots",
  });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // const handlePreview = (fileList?: FileList) => {
  //   if (fileList && fileList.length > 0) {
  //     const urls = Array.from(fileList).map((file) =>
  //       URL.createObjectURL(file)
  //     );
  //     setPreviewUrls((prev) => [...prev, ...urls]);
  //   } else {
  //     setPreviewUrls([]);
  //   }
  // };

  // useEffect(() => {
  //   // Watch for changes in the screenshots field to generate previews
  //   const subscription = watch((value, { name }) => {
  //     if (name && name.startsWith("screenshots")) {
  //       const index = parseInt(name.split(".")[1], 10);
  //       const fileList = value.screenshots?.[index]?.file;
  //       handlePreview(fileList);
  //     }
  //   });
  //   return () => subscription.unsubscribe();
  // }, [control, watch]);

  const onSubmit = async (data: CreateTaskSubmissionInput) => {
    if (
      data.submission === "<p><br></p>" &&
      (!data.screenshots || data.screenshots.length === 0)
    ) {
      fail_notify("Please provide a submission or at least one screenshot.");
      return;
    }
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("taskId", taskId);
    formData.append("weekId", weekId);
    if (data.submission) formData.append("submission", data.submission);

    const filesArray: File[] = [];
    if (data.screenshots) {
      data.screenshots.forEach((doc) => {
        if (doc && doc.file) {
          filesArray.push(doc.file[0]);
        }
      });
    }

    if (filesArray.length) {
      filesArray.forEach((file) => {
        formData.append(`screenshots`, file);
      });
    }
    // console.log("FormData contents:");
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }
    submitTask(formData);
  };

  useEffect(() => {
    if (isSubmitError) {
      console.error("Error fetching task categories:", submitError);
      const errMsg =
        (submitError as AxiosError).response?.data?.message ||
        "An error occurred while fetching task categories.";
      fail_notify(errMsg);
    }
  }, [submitError, isSubmitError]);

  useEffect(() => {
    if (submitSuccess) {
      success_notify("Task submitted successfully!");
      setPreviewUrls([]);
      closeModal();
    }
  }, [closeModal, submitSuccess]);

  return (
    <div className="w-full flex flex-col justify-center mx-auto gap-5">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Controller
            name="submission"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Reflections
                </label>
                <RichText
                  {...field}
                  value={field.value || ""}
                  setValue={(val) => field.onChange(val)}
                  onBlur={field.onBlur}
                  placeholder="Write your reflections here ..."
                />
                {errors.submission && (
                  <p className="text-red-500 text-xs">
                    {errors.submission?.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700">
            Screenshot Uploads (if any)
          </label>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="w-full flex items-center gap-3 bg-gray-50 p-3 rounded-xl shadow-sm"
            >
              <div className="flex flex-col w-full gap-1">
                <label className="text-xs font-semibold text-gray-600">
                  Screenshot {index + 1}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition"
                  {...register(`screenshots.${index}.file` as const)}
                />
              </div>
              <button
                type="button"
                className="text-red-500 hover:text-red-600 p-2 rounded-lg transition"
                aria-label="Remove Document"
                onClick={() => remove(index)}
              >
                <FaTrash size={18} />
              </button>
            </div>
          ))}

          <div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-600 transition"
              onClick={() => append({ file: undefined })}
            >
              <FaPlus size={16} />
              Add Screenshot
            </button>
          </div>
        </div>

        {previewUrls.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-2">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="w-24 h-24 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`screenshot-${idx}`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          isLoading={submitPending}
          disabled={submitPending || submitSuccess}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default SubmitDailyTask;
