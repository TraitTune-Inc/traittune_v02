import React, { useState } from 'react';
import { psychometricTests } from '../../data/psychometricTests';
import { PsychometricTest, TestResponse, TestResult } from '../../types/tests';
import TestSelection from './TestSelection';
import TestContainer from './TestContainer';

interface PsychometricTestProps {
  onComplete: (result: TestResult) => void;
}

export default function PsychometricTest({ onComplete }: PsychometricTestProps) {
  const [selectedTest, setSelectedTest] = useState<PsychometricTest | null>(null);

  const handleTestComplete = (responses: TestResponse[]) => {
    if (!selectedTest) return;

    const result: TestResult = {
      testId: selectedTest.id,
      responses,
      completedAt: Date.now(),
      // In a real application, you would calculate scores and generate insights here
      summary: {
        scores: {},
        insights: [],
        recommendations: []
      }
    };

    onComplete(result);
  };

  if (!selectedTest) {
    return <TestSelection tests={psychometricTests} onSelect={setSelectedTest} />;
  }

  return <TestContainer test={selectedTest} onComplete={handleTestComplete} />;
}