
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="mt-4 bg-red-800/50 border border-red-600 text-red-200 px-4 py-3 rounded-md" role="alert">
      <strong className="font-bold">错误：</strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};