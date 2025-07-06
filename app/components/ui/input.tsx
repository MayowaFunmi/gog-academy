import React, { InputHTMLAttributes, forwardRef } from 'react';
import classNames from 'classnames';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    // const baseClasses = 'px-4 py-2 border w-full rounded-md focus:outline-none focus:ring-opacity-50 transition-all duration-200';
    const enabledClasses = 'border-gray-400 focus:ring-primary';
    const invalidClasses = 'border-red-500 focus:ring-none';
    const disabledClasses = 'border-gray-400 text-gray-200 cursor-not-allowed bg-gray-100';

    return (
      <input
        ref={ref}
        className={classNames(
          // baseClasses,
          invalid ? invalidClasses : 'focus:ring-2',
          props.disabled ? disabledClasses : enabledClasses,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
export default Input;
