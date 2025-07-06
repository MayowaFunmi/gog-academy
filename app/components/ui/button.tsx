import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  className,
  ...props
}) => {
  const enabledClasses = 'bg-primary text-white hover:bg-opacity-70';
  const disabledClasses = 'cursor-not-allowed bg-primary text-white bg-opacity-60 opacity-60';
  const spinnerColorClass = 'text-current';

  return (
    <button
      className={classNames(
        !disabled && !isLoading ? enabledClasses : disabledClasses,
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className={classNames('animate-spin h-5 w-5 mr-2', spinnerColorClass)} // Apply spinner color
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M12 2a10 10 0 0110 10h-4a6 6 0 00-6-6V2z"
            />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
