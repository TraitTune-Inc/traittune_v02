import React, { useState, useEffect } from 'react';
import { PsychometricTest, TestResponse } from '../../types/tests';
import TestProgress from './TestProgress';
import ScaleQuestion from './QuestionTypes/ScaleQuestion';
import SingleChoiceQuestion from './QuestionTypes/SingleChoiceQuestion';

interface TestContainerProps {
  test: PsychometricTest;
  onComplete: (responses: TestResponse[]) => void;
}

export default function TestContainer({ test, onComplete }: TestContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<TestResponse[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(test.estimatedTime * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentQuestion = test.questions[currentQuestionIndex];
  const currentResponse = responses.find(
    (r) => r.questionId === currentQuestion.id
  );

  const handleResponse = (value: number) => {
    const newResponse: TestResponse = {
      questionId: currentQuestion.id,
      value,
      timestamp: Date.now(),
    };

    setResponses((prev) => {
      const existing = prev.findIndex((r) => r.questionId === currentQuestion.id);
      if (existing !== -1) {
        const updated = [...prev];
        updated[existing] = newResponse;
        return updated;
      }
      return [...prev, newResponse];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <TestProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={test.questions.length}
        timeRemaining={timeRemaining}
      />

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {currentQuestion.type === 'scale' ? (
          <ScaleQuestion
            question={currentQuestion}
            value={currentResponse?.value || 0}
            onChange={handleResponse}
          />
        ) : (
          <SingleChoiceQuestion
            question={currentQuestion}
            value={currentResponse?.value || 0}
            onChange={handleResponse}
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!currentResponse}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === test.questions.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
}