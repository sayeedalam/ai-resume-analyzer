
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      <p className="mt-4 text-gray-400">AI is thinking...</p>
    </div>
  );
};
