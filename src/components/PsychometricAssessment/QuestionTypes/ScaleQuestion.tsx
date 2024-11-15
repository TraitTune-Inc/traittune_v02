import React from 'react';
import { TestQuestion } from '../../../types/tests';

interface ScaleQuestionProps {
  question: TestQuestion;
  value: number;
  onChange: (value: number) => void;
}

export default function ScaleQuestion({ 
  question, 
  value, 
  onChange 
}: ScaleQuestionProps) {
  const { scaleRange } = question;
  if (!scaleRange) return null;

  const { min, max, minLabel, maxLabel } = scaleRange;
  const options = Array.from(
    { length: max - min + 1 }, 
    (_, i) => min + i
  );

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium text-gray-900">{question.text}</p>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="flex justify-between w-full text-sm text-gray-600">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
        
        <div className="flex justify-between w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                ${value === option 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}