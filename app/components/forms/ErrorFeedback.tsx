import React, { ReactNode } from 'react';

interface FormFeedbackProps {
  children: ReactNode;
  invalid: boolean;
}

const ErrorFeedback: React.FC<FormFeedbackProps> = ({ children, invalid }) => {
  
  return  invalid && <div className={`mt-1 text-sm text-red-600`}>{children}</div>;
};

export default ErrorFeedback;
