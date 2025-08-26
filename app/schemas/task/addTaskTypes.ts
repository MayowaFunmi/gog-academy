import * as yup from "yup"

const addTaskTypesSchema = yup.object().shape({
  cohortId: yup.string().required("Select a cohort"),
  name: yup.string().required("Enter a name"),
  requiresAttendance: yup.boolean().typeError("Set as either true or false").optional(),
  requiresSubmissions: yup.boolean().typeError("Set as either true or false").optional(),
  requiresMark: yup.boolean().typeError("Set as either true or false").optional(),
})

export default addTaskTypesSchema