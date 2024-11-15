import React from 'react';
import { TestQuestion } from '../../../types/tests';

interface SingleChoiceQuestionProps {
  question: TestQuestion;
  value: number;
  onChange: (value: number) => void;
}

export default function SingleChoiceQuestion({ 
  question, 
  value, 
  onChange 
}: SingleChoiceQuestionProps) {
  if (!question.options) return null;

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900">{question.text}</p>
      
      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.value)}
            className={`w-full p-4 text-left rounded-lg transition-colors
              ${value === option.value
                ? 'bg-indigo-50 border-2 border-indigo-600'
                : 'bg-white border-2 border-gray-200 hover:border-indigo-600'
              }`}
          >
            <span className={`text-base ${
              value === option.value ? 'text-indigo-600' : 'text-gray-900'
            }`}>
              {option.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}