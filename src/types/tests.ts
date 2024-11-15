export interface TestOption {
  id: string;
  text: string;
  value: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  type: 'single' | 'scale';
  options?: TestOption[];
  scaleRange?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
}

export interface PsychometricTest {
  id: string;
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  questions: TestQuestion[];
  category: 'personality' | 'cognitive' | 'emotional' | 'behavioral';
}

export interface TestResponse {
  questionId: string;
  value: number;
  timestamp: number;
}

export interface TestResult {
  testId: string;
  responses: TestResponse[];
  completedAt: number;
  summary?: {
    scores: Record<string, number>;
    insights: string[];
    recommendations: string[];
  };
}