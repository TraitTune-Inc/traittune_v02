import React from 'react';
import { Brain, Heart, Check, Clock, RefreshCw } from 'lucide-react';
import { PsychometricTest } from '../../types/tests';
import { formatTimeAgo } from '../../lib/timeUtils';
import { useAuth } from '../../lib/auth';

interface TestSelectionProps {
  tests: PsychometricTest[];
  completedTests: Array<{
    testId: string;
    completedAt: number;
  }>;
  onSelect: (test: PsychometricTest) => void;
  onRetake?: (test: PsychometricTest) => void;
  onComplete?: () => void;
  allTestsCompleted?: boolean;
}

export default function TestSelection({ 
  tests, 
  completedTests,
  onSelect,
  onRetake,
  onComplete,
  allTestsCompleted = false
}: TestSelectionProps) {
  const { user } = useAuth();

  // Get actual counts
  const completedCount = completedTests.filter(ct => 
    tests.some(test => test.id === ct.testId)
  ).length;
  const totalTests = tests.length;
  const remainingTests = totalTests - completedCount;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Test Progress Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Assessment Progress</h3>
            <p className="mt-1 text-sm text-gray-500">
              {completedCount} of {totalTests} tests completed
              {remainingTests > 0 && ` (${remainingTests} remaining)`}
            </p>
          </div>
          {allTestsCompleted && (
            <div className="flex items-center text-green-600">
              <Check className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">All tests completed</span>
            </div>
          )}
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalTests) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Test Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {tests.map((test) => {
          const completion = completedTests.find(ct => ct.testId === test.id);
          const isCompleted = !!completion;
          const Icon = test.category === 'personality' ? Brain : Heart;
          
          return (
            <div
              key={test.id}
              className={`relative flex flex-col p-6 bg-white rounded-lg shadow-sm border-2 transition-colors ${
                isCompleted 
                  ? 'border-green-200'
                  : 'border-gray-200 hover:border-indigo-600'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-lg ${
                  isCompleted ? 'bg-green-50' : 'bg-indigo-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isCompleted ? 'text-green-600' : 'text-indigo-600'
                  }`} />
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
              
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {test.description}
              </p>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                {isCompleted ? (
                  <>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {formatTimeAgo(completion.completedAt)}
                    </div>
                    {user && (
                      <button
                        onClick={() => onRetake?.(test)}
                        className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4 mr-1.5" />
                        Retake Test
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => onSelect(test)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Start Test
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Assessment Button */}
      {allTestsCompleted && onComplete && (
        <div className="flex justify-end mt-8">
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Check className="w-5 h-5 mr-2" />
            Complete Assessment
          </button>
        </div>
      )}
    </div>
  );
}