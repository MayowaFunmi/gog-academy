import * as yup from "yup";

export const bioDataSchema = yup.object({
  title: yup.string().required("Title is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  address: yup.string().required("Address is required"),
  stateOfResidence: yup.string().optional(),
  country: yup.string().required("Country is required"),
  maritalStatus: yup.string().required("Marital status is required"),
  occupation: yup.string().required("Occupation is required"),
});

export const salvationSchema = yup.object({
    salvationStatus: yup.string().required(),
    salvationStory: yup.string().required(),
  })

export const membershipSchema = yup.object({
    gogMembershipStatus: yup.boolean().required(),
    gogMembershipYear: yup.string().optional(),
    previouslyApplied: yup.boolean().required(),
    classCommitmentStatus: yup.boolean().required(),
    assignmentCommitmentStatus: yup.boolean().required(),
    reasonForJoining: yup.string().required(),
    churchName: yup.string().required(),
  })

  export const referenceSchema = yup.object({
    refereeName: yup.string().required(),
    refereePhoneNumber: yup.string().min(10).required(),
    refereeEmail: yup.string().email().required(),
    refereeRelationship: yup.string().required(),
  })

  export const consentSchema = yup.object({
    consentCheck: yup.boolean().required(),
  })
