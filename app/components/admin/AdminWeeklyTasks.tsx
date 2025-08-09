"use client";

import { formatDateRange, removeHour } from "@/app/utils/formatDate";
import React, { useState } from "react";
import Button from "../ui/button";
import DailyTask from "./DailyTask";
import Modal from "../ui/Modal";

interface AdminWeeklyTasksProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
  cohortId: string;
  weekId: string
}

const AdminWeeklyTasks = ({
  weekNumber,
  startDate,
  endDate,
  cohortId,
  weekId
}: AdminWeeklyTasksProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="mt-3 px-3">
      <div className="text-2xl font-semibold text-gray-800">
        Tasks for Week {weekNumber}
      </div>
      <div className="text-gray-600">
        {formatDateRange(new Date(startDate), removeHour(new Date(endDate)))}
      </div>
      <div className="w-full mt-5 text-gray-600 border border-t-2 border-t-blue-600 border-x-gray-300 border-b-gray-400 rounded-lg">
        <div className="w-full p-3 bg-white border-b border-b-gray-300">
          <div className="md:w-1/4 w-full flex items-center justify-center space-x-2 pb-2">
            <Button
              className="md:w-full w-1/2 rounded-md bg-pink-600 px-4 py-2 text-white font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              onClick={() => setIsOpen(true)}
            >
              Add new task
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          closeModal={handleCloseModal}
          title="Add New Task"
          widthClass="max-w-3xl"
        >
          <DailyTask
            closeModal={handleCloseModal}
            cohortId={cohortId}
            weekId={weekId}
            weekStart={startDate}
            // weekEnd={endDate}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminWeeklyTasks;
