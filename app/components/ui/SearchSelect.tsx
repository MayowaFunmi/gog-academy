import { SelectInputOption } from "@/app/types/user";
import React, { useState } from "react";

interface SearchableSelectProps {
  options: SelectInputOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeHolder?: string;
  invalid?: boolean;
}

const SearchSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeHolder,
  invalid,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options?.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options?.find((opt) => opt?.value === value)?.label;

  return (
    <div className="relative w-full">
      {/* Select box */}
      <div
        className={`border rounded-md px-3 py-2 flex items-center justify-between cursor-pointer ${
          invalid ? "border-red-500" : "border-gray-300"
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="truncate">
          {selectedLabel || placeHolder || "Select..."}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg">
          {/* Search input */}
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 outline-none text-sm"
          />
          {/* Options */}
          <div className="max-h-48 overflow-auto">
            {filteredOptions?.length > 0 ? (
              filteredOptions?.map((opt) => (
                <div
                  key={opt?.value}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    onChange(opt?.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  {opt?.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
