import React, { useRef, useEffect } from 'react';

interface QuestionInputProps {
  id: string;
  type: string;
  header: string;
  description: string;
  value: string;
  maxLength: number;
  onChange: (id: string, value: string) => void;
  hasError: boolean;
}

export default function QuestionInput({
  id,
  header,
  description,
  value = '',
  maxLength,
  onChange,
  hasError
}: QuestionInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isExceeded = value.length > maxLength;

  useEffect(() => {
    if (hasError && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasError]);

  return (
    <div className="space-y-2" id={`question-${id}`}>
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-gray-900">
          {header} <span className="text-xs font-normal text-gray-500">*(Max {maxLength} characters)</span>
        </h3>
        <p className="text-sm text-gray-600 italic">{description}</p>
      </div>
      <div className="relative">
        <textarea
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          rows={4}
          className={`block w-full rounded-md shadow-sm transition-colors
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }
          `}
          aria-describedby={`${id}-description`}
        />
        <div 
          className={`absolute right-2 -bottom-6 text-xs ${
            isExceeded ? 'text-red-500' : 'text-gray-500'
          }`}
        >
          {value.length}/{maxLength} characters
          {isExceeded && (
            <span className="ml-1">
              ({value.length - maxLength} over limit)
            </span>
          )}
        </div>
      </div>
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          Please reduce your response to {maxLength} characters or less
        </p>
      )}
    </div>
  );
}