import * as yup from "yup"

const addTaskTypesSchema = yup.object().shape({
  cohortId: yup.string().required("Select a cohort"),
  name: yup.string().required("Enter a name"),
})

export default addTaskTypesSchema