import { z } from "zod";

export const userRegistrationSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters long"),
  // matricNumber: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  gender: z.enum(["Male", "Female"]),
  email: z.string().email("Invalid email address"),
  role: z.string().min(2, "Role must not be empty"),
  phoneNumber: z
    .string()
    .min(11)
    .regex(/^\d+$/, "Phone number must be a at least 10 valid numbers"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userLoginSchema = z.object({
  username: z.string().min(6, "Username must be at least 6 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const TitleEnum = z.enum([
  "Mr",
  "Mrs",
  "Miss",
  "Brother",
  "Sister",
  "Dr",
  "Prof",
  "Rev",
  "Pastor",
  "Evangelist",
  "Apostle",
  "Bishop",
  "Elder",
  "Deacon",
  "Deaconess",
  "Prophet",
  "Prophetess",
  "Chief",
  "Honorable",
]);

export const userProfileSchema = z.object({
  title: TitleEnum,
  dateOfBirth: z
    .string()
    .datetime({ message: "Invalid date." }),
  address: z
    .string({
      required_error: "Address is required",
    })
    .min(1, { message: "Address cannot be empty" }),
  stateOfResidence: z
    .string()
    .min(1, { message: "State of residence is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  maritalStatus: z.string().min(1, { message: "Marital status is required" }),
  salvationStatus: z
    .string()
    .min(1, { message: "Salvation status is required" }),
  salvationStory: z.string().min(1, { message: "Salvation story is required" }),
  gogMembershipStatus: z
    .boolean({
    required_error: "Your GOG mmbership status is required",
    invalid_type_error: "GOG mmbership status must be a boolean",
  }),
  gogMembershipDate: z
    .string()
    .datetime({ message: "Invalid date." }),
  classCommitmentStatus: z
    .boolean({
    required_error: "You must agree to commit yourself to attending GOG academy classes",
    invalid_type_error: "must be a boolean",
  }),
  assignmentCommitmentStatus: z
    .boolean({
    required_error: "You must agree to commit yourself to submitting assignments",
    invalid_type_error: "must be a boolean",
  }),
  reasonForJoining: z
    .string()
    .min(1, { message: "State your reason for joining GOG Academy" }),
  churchName: z.string().min(1, { message: "Your church name is required" }),
  occupation: z.string().min(1, { message: "Your occupation is required" }),
  profilePicture: z.string().optional(),
  refereeName: z.string().min(1, { message: "Referee name is required" }),
  refereePhoneNumber: z
    .string()
    .min(11)
    .regex(/^\d+$/, "Phone number must be a at least 10 valid numbers"),
  refereeEmail: z.string().email("Invalid email address"),
  refereeRelationship: z
    .string()
    .min(1, { message: "State your relationship with your referee" }),
  consentCheck: z.boolean({
    required_error: "Your consent is required",
    invalid_type_error: "consent must be a boolean",
  }),
});

export type UserRegistrationDto = z.infer<typeof userRegistrationSchema>;
export type UserLoginDto = z.infer<typeof userLoginSchema>;
export type UserProfileDto = z.infer<typeof userProfileSchema>;
