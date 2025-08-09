import * as yup from 'yup';

export const dailyTaskSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  taskTypeId: yup.string().required("Task type is required"),
  dayOfWeek: yup
    .number()
    .min(0)
    .max(6)
    .required("Day of week is required"),
  hour: yup
    .number()
    .min(0)
    .max(23)
    .required("Start hour is required"),
});
