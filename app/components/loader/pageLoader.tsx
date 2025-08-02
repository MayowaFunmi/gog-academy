"use client";

// import { ScaleLoader } from "react-spinners";
import { FaSpinner } from "react-icons/fa";

export default function PageLoader() {
  return (
    // <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    //   <ScaleLoader color="#1FAB89" />
    // </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
      <FaSpinner className="text-5xl text-gray-600 animate-spin" />
    </div>
  );
}
