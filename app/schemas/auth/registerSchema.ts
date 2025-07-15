import * as yup from "yup";

export const createUserSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, "Username must be at least 6 characters")
    .required("Username is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  gender: yup.string().required("Gender is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email address is required"),
  role: yup.string().required("Role is required"),
  phoneNumber: yup
    .string()
    .min(11, "Phone number must be at least 11 numbers")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .typeError("Password is required")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});

export const loginSchema = yup.object().shape({
  username: yup.string().required("Username/phone number/email is required"),
  password: yup.string().required("Password is required"),
});
