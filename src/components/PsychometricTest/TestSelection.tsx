import React from 'react';
import { PsychometricTest } from '../../types/tests';
import { Clock, Brain, Heart, Activity } from 'lucide-react';

const categoryIcons = {
  personality: Brain,
  cognitive: Activity,
  emotional: Heart,
  behavioral: Clock,
};

interface TestSelectionProps {
  tests: PsychometricTest[];
  onSelect: (test: PsychometricTest) => void;
}

export default function TestSelection({ tests, onSelect }: TestSelectionProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Select Psychometric Assessment
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {tests.map((test) => {
          const Icon = categoryIcons[test.category];
          
          return (
            <button
              key={test.id}
              onClick={() => onSelect(test)}
              className="flex flex-col p-6 bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:border-indigo-600 transition-colors text-left"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {test.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {test.estimatedTime} minutes
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 flex-grow">
                {test.description}
              </p>
              
              <div className="mt-4 flex items-center text-sm text-indigo-600">
                <span>Start Assessment</span>
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}