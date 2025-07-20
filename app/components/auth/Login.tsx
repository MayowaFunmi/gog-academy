"use client";

import React, { useState } from "react";
import Image from "next/image";
import Input from "../ui/input";
import Link from "next/link";
import Button from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/app/schemas/auth/registerSchema";
import { fail_notify, success_notify } from "@/app/utils/constants";
import { useRouter } from "next/navigation";
import { LoginFields } from "@/app/types/auth";
import { signIn } from "next-auth/react";

const Login = () => {
   const router = useRouter()
   const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFields> = async (data) => {
    setLoading(true)
    const result = await signIn("credentials", {
      redirect: false,
      username: data?.username,
      password: data?.password,
    })
    if (result?.ok) {
      success_notify("Login successful");
      router.push("/redirect");
    } else {
      fail_notify("Login failed");
    }
    setLoading(false)
  }

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
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Username/Phone Number/Email address
              </label>
              <Input
                {...register("username")}
                type="text"
                id="username"
                autoComplete="username"
                required
                placeholder="Enter your username or phone number or email address"
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
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                {...register("password")}
                type="password"
                id="password"
                autoComplete="current-password"
                required
                placeholder="Enter Password"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
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
              isLoading={loading}
              className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-indigo-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
