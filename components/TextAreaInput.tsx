
import React from 'react';

interface TextAreaInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, label, value, onChange, placeholder, icon }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
      <label htmlFor={id} className="flex items-center text-lg font-semibold text-gray-200 mb-3">
        <span className="mr-2 text-indigo-400">{icon}</span>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={15}
        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-300 placeholder-gray-500 text-sm"
      />
    </div>
  );
};
