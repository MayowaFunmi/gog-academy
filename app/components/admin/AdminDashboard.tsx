import React from "react";
import Select from "../ui/select";
import Button from "../ui/button";

const AdminDashboard = () => {
  return (
    <div className="my-3 px-3">
      <div className="text-2xl font-semibold text-gray-800">Dashboard</div>
      <div className="w-full mt-2 text-gray-600 border border-t-2 border-t-blue-600 border-x-gray-300 border-b-gray-400 rounded-lg">
        <div className="flex items-center justify-between p-3 bg-white border-b border-b-gray-300">
          <p className="font-normal text-sm">Filter</p>
          <div className="bg-pink-400">
            <p className="text-white text-xs font-semibold px-2 py-1">
              Mount Zion A | 2025
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-3 p-3 bg-white border-b border-b-gray-300">
          <p className="font-normal text-sm">Cohort</p>
          <div className="w-1/2">
            <Select>
              <option value="cohort1">Cohort 1</option>
              <option value="cohort2">Cohort 2</option>
              <option value="cohort3">Cohort 3</option>
            </Select>
          </div>
          <div className="w-1/4 flex items-center justify-center space-x-2 pb-2">
            <Button className="w-full rounded-md bg-pink-600 px-4 py-2 text-white font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500">
              Apply Filter
            </Button>
            <Button className="w-full rounded-md bg-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300">
              Reset Filter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
