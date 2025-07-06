import React, { forwardRef, TextareaHTMLAttributes } from 'react';
import classNames from 'classnames';

interface CustomTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelClassName?: string;
  invalid?: string;
  className?: string;
  row: number
  cols: number
}

const Textarea = forwardRef<HTMLTextAreaElement, CustomTextareaProps>(({
  label,
  labelClassName,
  invalid,
  className,
  ...rest
}, ref) => {
  const hasAsterisk = label && label.endsWith('*');
  const labelText = hasAsterisk ? label.slice(0, -1) : label;
  return (
    <div className={classNames(className)}>
      {label && (
        <label className={classNames(labelClassName)}>
          {labelText}
          {hasAsterisk && <span className='text-[#FF5656]'>*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={classNames(
          'px-3 py-2 border rounded-md border-gray-400 focus:outline-none w-full focus:ring-opacity-50 focus:ring-primary transition-all duration-200',
          invalid && 'border focus:ring-none',
          !invalid && 'focus:ring-2',
          //'resize-none' // Prevent resizing of the textarea
        )}
        {...rest}
      />
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
