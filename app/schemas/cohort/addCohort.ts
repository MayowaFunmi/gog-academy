import * as yup from "yup";

const addCohortSchema = yup.object().shape({
  cohort: yup.string().required("Cohort name is required"),
  batch: yup.string().required("Batch is required"),
  startDate: yup
    .string()
    .required("Start date is required")
    .test("is-valid-date", "Start date must be a valid date", (value) => {
      return !isNaN(Date.parse(value || ""));
    })
    .test(
      "start-before-end",
      "Start date must not be after end date",
      function (value) {
        const { endDate } = this.parent;
        if (!value || !endDate) return true; // Skip if one is missing
        return new Date(value) <= new Date(endDate);
      }
    ),

  endDate: yup
    .string()
    .required("End date is required")
    .test("is-valid-date", "End date must be a valid date", (value) => {
      return !isNaN(Date.parse(value || ""));
    }),
});

export default addCohortSchema;
