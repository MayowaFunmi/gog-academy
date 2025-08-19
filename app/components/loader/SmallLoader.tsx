import { FaSpinner } from "react-icons/fa";

export default function SmallLoader() {
  return (
    <div className="flex flex-row w-[100%] justify-center h-full items-center">
      <FaSpinner height={20} color="#1FAB89" />
    </div>
  );
}