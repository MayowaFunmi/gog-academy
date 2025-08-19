import React from "react";
import { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

interface SelectFormProps<T extends FieldValues> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: Path<T>;
  label: string;
  options: string[];
  register: UseFormRegister<T>;
  required?: boolean;
  error?: FieldError;
}

function SelectForm<T extends FieldValues>({
  id,
  label,
  options,
  register,
  required,
  error,
  ...rest
}: SelectFormProps<T>) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        {...register(id)}
        id={id}
        {...rest}
        required={required}
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
          rest.className || ""
        }`}
        
      >
        <option value="">Select {label}</option>
        {options.map((opt, index) => (
          <option
            key={index}
            value={opt}
          >
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
    </div>
  );
};

export default SelectForm;
