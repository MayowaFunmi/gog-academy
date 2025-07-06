"use client";

import { ScaleLoader } from "react-spinners";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <ScaleLoader color="#1FAB89" />
    </div>
  );
}
