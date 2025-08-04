"use client";

import React, { useEffect } from "react";
import { FiBell } from "react-icons/fi";
import Image from "next/image";
import { useSignOutUser } from "@/app/hooks/auth";
import { signOut } from "next-auth/react";
import { fail_notify, success_notify } from "@/app/utils/constants";
import { useGetCurrentCohort } from "@/app/hooks/cohorts";
import { AxiosError } from "axios";

const TopNavbar = () => {
  const { mutate: logOut, isSuccess } = useSignOutUser();
  const handleSignOut = () => {
    logOut();
  };

  const {
    data: currentCohort,
    isLoading: isLoadingCurrentCohort,
    isSuccess: isSuccessCurrentCohort,
    isError: isErrorCurrentCohort,
    error: currentCohortError,
  } = useGetCurrentCohort();

  useEffect(() => {
    if (isSuccess) {
      success_notify("You have successfully logged out");
      signOut({ callbackUrl: "/auth/login" });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isErrorCurrentCohort) {
      console.error("Error fetching cohorts:", currentCohortError);
      const errMsg =
        (currentCohortError as AxiosError).response?.data?.message ||
        "An error occurred while fetching cohorts.";
      fail_notify(errMsg);
    }

    if (currentCohort?.status === "notFound") {
      fail_notify("Current cohort not found");
    }
  }, [currentCohort?.status, currentCohortError, isErrorCurrentCohort]);

  return (
    <div className="shadow-md bg-white fixed top-0 left-[20%] w-[80%] z-50 px-4 py-3">
      <div className="w-full flex justify-between items-center">
        {/* Left: Logo + Welcome */}
        <div className="flex items-center gap-3 min-w-[30%]">
          <Image
            src="/assets/images/gog-logo.png"
            alt="GOG Academy Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="hidden lg:block text-gray-700 text-lg font-semibold whitespace-nowrap">
            Welcome to GOG Academy
          </span>
        </div>

        {/* Center: Cohort Info */}
        <div className="text-center min-w-[30%]">
          {isLoadingCurrentCohort && (
            <p className="text-gray-800 font-medium">
              Loading current cohort...
            </p>
          )}
          {currentCohort?.status === "notFound" && (
            <p className="text-gray-800 font-medium">
              Current cohort not found
            </p>
          )}
          {isSuccessCurrentCohort && currentCohort && (
            <>
              <small className="block text-gray-500">Current Cohort</small>
              <p className="text-gray-800 font-medium">
                {currentCohort?.data?.cohort} | Batch{" "}
                {currentCohort?.data?.batch}
              </p>
            </>
          )}
        </div>

        {/* Right: Notifications + Logout */}
        <div className="flex items-center justify-end gap-5 min-w-[30%]">
          <div className="relative cursor-pointer">
            <FiBell size={25} color="#374151" />
            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </div>
          </div>

          <div className="text-red-700 cursor-pointer" onClick={handleSignOut}>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
