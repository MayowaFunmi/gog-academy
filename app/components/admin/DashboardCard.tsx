import React from "react";
import Button from "../ui/button";

interface DashboardCardProps {
  color: string;
}
const DashboardCard = ({ color }: DashboardCardProps) => {
  return (
    <div className={`rounded-lg overflow-hidden shadow-lg relative ${color}`}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">Total Users</h3>
        <p className="text-2xl font-bold text-white">1,234</p>
      </div>
      <div className="absolute top-0 right-0 p-2">
        <Button className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
          View Details
        </Button>
      </div>
    </div>
  );
};

export default DashboardCard;
