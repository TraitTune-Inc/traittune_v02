import { TestResponse, TestResult, PsychometricTest } from '../types/tests';

interface ScoreRanges {
  [key: string]: {
    min: number;
    max: number;
    interpretation: string;
    recommendation: string;
  };
}

const scoreRanges: Record<string, ScoreRanges> = {
  'big-five': {
    openness: {
      min: 1,
      max: 5,
      interpretation: 'Openness to experience',
      recommendation: 'Consider exploring new learning opportunities'
    },
    conscientiousness: {
      min: 1,
      max: 5,
      interpretation: 'Conscientiousness and organization',
      recommendation: 'Focus on maintaining structured approaches'
    },
    extraversion: {
      min: 1,
      max: 5,
      interpretation: 'Social engagement and energy',
      recommendation: 'Balance social interactions with personal time'
    },
    agreeableness: {
      min: 1,
      max: 5,
      interpretation: 'Interpersonal harmony',
      recommendation: 'Maintain collaborative relationships'
    },
    neuroticism: {
      min: 1,
      max: 5,
      interpretation: 'Emotional stability',
      recommendation: 'Practice stress management techniques'
    }
  },
  'emotional-intelligence': {
    awareness: {
      min: 1,
      max: 5,
      interpretation: 'Emotional awareness',
      recommendation: 'Practice mindfulness and self-reflection'
    },
    regulation: {
      min: 1,
      max: 5,
      interpretation: 'Emotional regulation',
      recommendation: 'Develop emotional management strategies'
    },
    empathy: {
      min: 1,
      max: 5,
      interpretation: 'Empathy and understanding',
      recommendation: 'Enhance active listening skills'
    }
  }
};

function calculateDimensionScore(responses: TestResponse[], dimension: string): number {
  const dimensionResponses = responses.filter(r => r.questionId.startsWith(dimension));
  if (dimensionResponses.length === 0) return 0;
  
  const sum = dimensionResponses.reduce((acc, r) => acc + r.value, 0);
  return Number((sum / dimensionResponses.length).toFixed(2));
}

function generateInsights(scores: Record<string, number>, testId: string): string[] {
  const insights: string[] = [];
  const ranges = scoreRanges[testId];
  
  if (!ranges) return insights;

  Object.entries(scores).forEach(([dimension, score]) => {
    const range = ranges[dimension];
    if (!range) return;

    const level = score <= 2 ? 'low' : score >= 4 ? 'high' : 'moderate';
    insights.push(
      `Your ${range.interpretation} shows a ${level} score of ${score}, indicating ${
        level === 'high' ? 'strong' : level === 'low' ? 'developing' : 'balanced'
      } tendencies in this area.`
    );
  });

  return insights;
}

function generateRecommendations(scores: Record<string, number>, testId: string): string[] {
  const recommendations: string[] = [];
  const ranges = scoreRanges[testId];
  
  if (!ranges) return recommendations;

  Object.entries(scores).forEach(([dimension, score]) => {
    const range = ranges[dimension];
    if (!range) return;

    if (score < 3) {
      recommendations.push(range.recommendation);
    }
  });

  return recommendations;
}

export function generateTestResult(
  test: PsychometricTest,
  responses: TestResponse[]
): TestResult {
  const scores: Record<string, number> = {};
  
  if (test.id === 'big-five') {
    scores.openness = calculateDimensionScore(responses, 'open');
    scores.conscientiousness = calculateDimensionScore(responses, 'con');
    scores.extraversion = calculateDimensionScore(responses, 'ext');
    scores.agreeableness = calculateDimensionScore(responses, 'agr');
    scores.neuroticism = calculateDimensionScore(responses, 'neu');
  } else if (test.id === 'emotional-intelligence') {
    scores.awareness = calculateDimensionScore(responses, 'ei');
    scores.regulation = calculateDimensionScore(responses, 'ei');
    scores.empathy = calculateDimensionScore(responses, 'ei');
  }

  const insights = generateInsights(scores, test.id);
  const recommendations = generateRecommendations(scores, test.id);

  return {
    testId: test.id,
    responses,
    completedAt: Date.now(),
    summary: {
      scores,
      insights,
      recommendations
    }
  };
}