import React from 'react';

interface TestProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  timeRemaining?: number;
}

export default function TestProgress({ 
  currentQuestion, 
  totalQuestions,
  timeRemaining 
}: TestProgressProps) {
  const progress = (currentQuestion / totalQuestions) * 100;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">
          Question {currentQuestion} of {totalQuestions}
        </span>
        {timeRemaining !== undefined && (
          <span className="text-sm font-medium text-gray-600">
            Time remaining: {formatTime(timeRemaining)}
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}