"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Input from "../ui/input";
import Link from "next/link";
import Button from "../ui/button";
import { useForm } from "react-hook-form";
import { createUserSchema } from "@/app/schemas/auth/registerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterFields } from "@/app/types/auth";
import { useRegisterUser } from "@/app/hooks/auth";
import { fail_notify, success_notify } from "@/app/utils/constants";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const router = useRouter();
  const {
    mutate: createUser,
    isPending,
    isSuccess,
    isError,
    error,
  } = useRegisterUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createUserSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data: RegisterFields) => {
    // console.log(`data = ${JSON.stringify(data, null, 2)}`);
    createUser(data);
  };

  useEffect(() => {
    if (isError) {
      console.error("Error creating user:", error);
      const errorMsg = (error as AxiosError).response?.data?.message;
      // const errorMsg2 = (error as AxiosError).response?.data?.data?.map((x: any) => x.message);
      fail_notify(`${errorMsg}` || "Error creating user");
    } else if (isSuccess) {
      success_notify("User registered successfully");
      reset();
      router.push("/auth/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error, isSuccess, reset]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Background Image (visible on lg+) */}
      <div className="hidden lg:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/images/large-gogo.jpg')" }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center px-6 py-0 lg:py-12 bg-white">
        <div className="w-full max-w-md space-y-3 lg:space-y-6">
          <div className="block lg:hidden text-center">
            <Image
              src="/assets/images/large-gogo.jpg"
              alt="Logo"
              width={1200}
              height={150}
              className="mx-auto mb-4"
            />
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Create an Account
            </h2>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <Input
                {...register("username")}
                type="text"
                id="username"
                autoComplete="username"
                required
                placeholder="Enter your username"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <Input
                {...register("firstName")}
                type="text"
                id="firstName"
                autoComplete="firstName"
                required
                placeholder="Enter your first name"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <Input
                {...register("lastName")}
                type="text"
                id="lastName"
                autoComplete="lastName"
                required
                placeholder="Enter your last name"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                {...register("gender")}
                id="gender"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                id="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Input
                {...register("phoneNumber")}
                type="number"
                id="phoneNumber"
                autoComplete="phoneNumber"
                required
                placeholder="Enter your phone number"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                I am a
              </label>
              <select
                {...register("role")}
                id="role"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a role</option>
                <option value="Student">Student</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="password"
                  required
                  placeholder="Enter Password"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirm-password"
                  required
                  placeholder="Enter Password Again"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span
                  className="absolute right-2 top-2 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link href="#" className="text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              isLoading={isPending}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
