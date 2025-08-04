"use client";

import React, { useEffect, useState } from "react";
import Select from "../ui/select";
import Button from "../ui/button";
import { FaUsers, FaUser, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useGetAllCohorts, useGetCohortById } from "@/app/hooks/cohorts";
import { AxiosError } from "axios";
import { fail_notify } from "@/app/utils/constants";
import PageLoader from "../loader/pageLoader";
import moment from "moment";
import { calculateDuration, getDateStatus } from "@/app/utils/formatDate";
import Modal from "../ui/Modal";
import AddCohort from "../cohorts/AddCohort";
import { FaCircle } from "react-icons/fa6";

const AdminDashboard = () => {
  const [selectedCohortId, setSelectedCohortId] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    data: cohorts,
    isLoading: cohortsLoading,
    isError: isCohortsError,
    error: cohortsError,
  } = useGetAllCohorts();

  const {
    data: selectedCohort,
    isLoading: selectedCohortLoading,
    isError: isSelectedCohortError,
    error: selectedCohortError,
  } = useGetCohortById(selectedCohortId);

  const cardColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-blue-300",
    "bg-yellow-500",
  ];

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isCohortsError) {
      console.error("Error fetching cohorts:", cohortsError);
      const errMsg =
        (cohortsError as AxiosError).response?.data?.message ||
        "An error occurred while fetching cohorts.";
      fail_notify(errMsg);
    }
  }, [cohortsError, isCohortsError]);

  const { isCurrent, isFuture, isPast } = getDateStatus(
    selectedCohort?.data?.startDate ?? "",
    selectedCohort?.data?.endDate ?? ""
  );

  useEffect(() => {
    if (isSelectedCohortError) {
      console.error("Error fetching selected cohort:", selectedCohortError);
      const errMsg =
        (selectedCohortError as AxiosError).response?.data?.message ||
        "An error occurred while fetching the selected cohort.";
      fail_notify(errMsg);
    }
  }, [selectedCohortError, isSelectedCohortError]);

  return (
    <div className="my-3 px-3">
      <div className="text-2xl font-semibold text-gray-800">Dashboard</div>
      {cohortsLoading ? null : ( // <PageLoader />
        <div className="w-full mt-5 text-gray-600 border border-t-2 border-t-blue-600 border-x-gray-300 border-b-gray-400 rounded-lg">
          <div className="flex items-center justify-between px-3 py-1 bg-white border-b border-b-gray-300">
            <p className="font-normal text-sm">Filter</p>
            {selectedCohort && (
              <div>
                <div className="flex items-center justify-center gap-2">
                  <p className="bg-pink-400 text-white text-normal font-bold px-2 py-1">
                    {`${selectedCohort?.data?.cohort} Batch ${selectedCohort?.data?.batch}`}{" "}
                    |{" "}
                    {new Date(
                      selectedCohort?.data?.startDate ?? ""
                    ).getFullYear()}
                  </p>

                  {isCurrent && (
                    <FaCircle className="text-green-500" title="Ongoing" />
                  )}
                  {isFuture && (
                    <FaCircle className="text-blue-400" title="Upcoming" />
                  )}
                  {isPast && (
                    <FaCircle className="text-gray-500" title="Completed" />
                  )}
                </div>
                <small>
                  {isCurrent ? "Current" : isFuture ? "Upcoming" : "Ended"}
                </small>
              </div>
            )}
          </div>
          <div className="w-full flex flex-col space-y-3 p-3 bg-white border-b border-b-gray-300">
            <p className="font-normal text-sm">Cohorts</p>
            <div className="md:w-1/2 w-full">
              <Select
                value={selectedCohortId}
                onChange={(e) => setSelectedCohortId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Select a cohort"
              >
                <option value="" disabled>
                  Select a cohort
                </option>
                {cohorts?.data?.cohorts?.map((cohort) => (
                  <option key={cohort.id} value={cohort.id}>
                    {cohort.cohort} Batch {cohort.batch}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:w-1/4 w-full flex items-center justify-center space-x-2 pb-2">
              <Button
                className="md:w-full w-1/2 rounded-md bg-pink-600 px-4 py-2 text-white font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                onClick={() => setIsOpen(true)}
              >
                Add new cohort
              </Button>
            </div>
          </div>

          <div className="mt-1 bg-white rounded-lg shadow-md p-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-3">
              {/* {cardColors.map((color, index) => (
              <DashboardCard key={index} color={color} />
            ))} */}
              {cohortsLoading || selectedCohortLoading ? (
                <PageLoader />
              ) : (
                <>
                  <div
                    className={`rounded-lg overflow-hidden shadow-lg relative ${cardColors[0]}`}
                  >
                    <div className="p-4 flex flex-col items-start space-y-6">
                      <h3 className="text-lg font-semibold text-white">
                        All Cohorts
                      </h3>
                      {/* total cohorts  */}
                      <div className="flex items-center gap-2 text-white text-2xl font-bold">
                        <span>{cohorts?.data?.cohorts?.length || cohorts?.data?.pagination?.totalItems}</span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-2 flex flex-col items-end gap-4">
                      {/* <Button className="bg-pink-400 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        View Details
                      </Button> */}
                      <FaUsers
                        className="text-gray-200"
                        size={50}
                        opacity={50}
                      />
                    </div>
                  </div>

                  <div
                    className={`rounded-lg overflow-hidden shadow-lg relative ${cardColors[1]}`}
                  >
                    <div className="p-4 flex flex-col items-start space-y-6">
                      <h3 className="text-lg font-semibold text-white">
                        This Cohort
                      </h3>
                      {/* registered candidates for current cohort */}
                      <div className="flex items-center gap-2 text-white text-2xl font-bold">
                        <span>{selectedCohort?.data?.userCount}</span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-2 flex flex-col items-end gap-4">
                      {/* <Button className="bg-pink-400 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        View Details
                      </Button> */}
                      <FaUser
                        className="text-gray-200"
                        size={50}
                        opacity={50}
                      />
                    </div>
                  </div>

                  <div
                    className={`rounded-lg overflow-hidden shadow-lg relative ${cardColors[2]}`}
                  >
                    <div className="p-4 flex flex-col items-start space-y-6">
                      <h3 className="text-lg font-semibold text-white">
                        Period
                      </h3>
                      {/* start date and end date */}
                      <div className="flex flex-col items-center gap-2 text-white text-sm font-bold">
                        <span>
                          Start:{" "}
                          {moment(selectedCohort?.data?.startDate).format(
                            "MMM D, YYYY"
                          )}
                        </span>
                        <span>
                          End:{" "}
                          {moment(selectedCohort?.data?.endDate).format(
                            "MMM D, YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-2 flex flex-col items-end gap-4">
                      {/* <Button className="bg-pink-400 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        View Details
                      </Button> */}
                      <FaCalendarAlt
                        className="text-gray-200"
                        size={50}
                        opacity={50}
                      />
                    </div>
                  </div>

                  <div
                    className={`rounded-lg overflow-hidden shadow-lg relative ${cardColors[3]}`}
                  >
                    <div className="p-4 flex flex-col items-start space-y-6">
                      <h3 className="text-lg font-semibold text-white">
                        Duration
                      </h3>
                      <div className="flex items-center gap-2 text-white text-2xl font-bold">
                        <span>
                          {calculateDuration(
                            selectedCohort?.data?.startDate ?? "",
                            selectedCohort?.data?.endDate ?? ""
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 p-2 flex flex-col items-end gap-4">
                      {/* <Button className="bg-pink-400 text-white text-xs font-semibold px-2 py-1 rounded-md">
                        View Details
                      </Button> */}
                      <FaClock
                        className="text-gray-200"
                        size={50}
                        opacity={50}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <Modal
          isOpen={isOpen}
          closeModal={handleCloseModal}
          title="Add New Cohort"
        >
          <AddCohort closeModal={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
