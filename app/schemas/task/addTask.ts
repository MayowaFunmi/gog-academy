import * as yup from "yup";

// export const addTaskSchema = yup.object().shape({
//   title: yup.string().optional(),
//   taskTypeId: yup.string().required("Select a task type"),
//   description: yup.string().required("Enter a description"),
//   weekId: yup.string().required("Select a week"),
//   dayOfWeek: yup.number().required("Select a day"),
//   startTime: yup.string().required("Select a start time"),
//   endTime: yup.string().required("Select an end time"),
//   // hasExtension: yup.boolean().required("Select if has extension"),
//   activated: yup.boolean().required("Select if activated"),
// });

export const dailyTaskSchema = yup.object().shape({
  title: yup.string().optional(),
  description: yup.string().required("Description is required"),
  weekId: yup.string().required("Select a week"),
  taskLink: yup.string().optional(),
  taskScriptures: yup.string().optional(),
  taskTypeId: yup.string().required("Task type is required"),
  dayOfWeek: yup.number().min(0).max(6).required("Day of week is required"),
  hourStart: yup.number().min(0).max(23).required("Start hour is required"),
  hourEnd: yup.number().min(0).max(23).required("End hour is required"),
  minuteStart: yup.number().min(0).max(59).optional().default(0),
  minuteEnd: yup.number().min(0).max(59).optional().default(59),
  activated: yup.boolean().required("Select if activated"),
});
