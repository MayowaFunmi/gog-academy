'use client'

import React, { forwardRef, useState } from 'react';
import classNames from 'classnames';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, disabled, children, placeholder, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = useState('');

    const baseClasses =
      'px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-opacity-50 transition-all duration-200';
    const enabledClasses = 'border-gray-400 focus:ring-primary';
    const invalidClasses = 'border-red-500 focus:ring-none';
    const disabledClasses = 'border-gray-400 text-gray-200 cursor-not-allowed bg-gray-100';

    return (
      <div className="relative">
        <select
          ref={ref}
          className={classNames(
            baseClasses,
            props['aria-invalid'] ? invalidClasses : 'focus:ring-2',
            disabled ? disabledClasses : enabledClasses,
            className,
            'appearance-none bg-white'
          )}
          disabled={disabled}
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          {...props}
        >
          {/* Placeholder option */}
          <option value="" disabled className='font-sfProDisplay font-normal text-[12px] leading-6 text-[#575656]'>
            {placeholder}
          </option>

          {/* Options */}
          {children}
        </select>
        {/* Arrow Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.92l3.72-3.69a.75.75 0 111.06 1.06l-4.25 4.22a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
