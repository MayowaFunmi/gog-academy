import * as yup from "yup";

export const createTaskSubmissionSchema = yup.object({
  submission: yup
    .string()
    .optional()
    .max(1000, "Submission must not exceed 1000 characters"),

  screenshots: yup
    .array()
    .of(
      yup.object().shape({
        file: yup
          .mixed<FileList>()
          .test("fileType", "Only JPEG/PNG images are allowed", (fileList) =>
            fileList
              ? Array.from(fileList).every((f) =>
                  ["image/jpeg", "image/jpg", "image/png"].includes(f.type)
                )
              : true
          )
          .test("fileSize", "File size must not exceed 5MB", (fileList) =>
            fileList
              ? Array.from(fileList).every((f) => f.size <= 5 * 1024 * 1024)
              : true
          ),
      })
    )
    .optional(),
});
