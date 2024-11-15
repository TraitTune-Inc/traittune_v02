import { PsychometricTest } from '../types/tests';

export const psychometricTests: PsychometricTest[] = [
  {
    id: 'big-five',
    title: 'Big Five Personality Assessment',
    description: 'Evaluate key personality dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.',
    estimatedTime: 15,
    category: 'personality',
    questions: [
      {
        id: 'ext-1',
        text: 'I feel comfortable in social situations',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Strongly Disagree',
          maxLabel: 'Strongly Agree'
        }
      },
      {
        id: 'con-1',
        text: 'I am always prepared',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Strongly Disagree',
          maxLabel: 'Strongly Agree'
        }
      },
      {
        id: 'open-1',
        text: 'I enjoy trying new things',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Strongly Disagree',
          maxLabel: 'Strongly Agree'
        }
      },
      {
        id: 'agr-1',
        text: 'I care about others\' feelings',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Strongly Disagree',
          maxLabel: 'Strongly Agree'
        }
      },
      {
        id: 'neu-1',
        text: 'I handle stress well',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Strongly Disagree',
          maxLabel: 'Strongly Agree'
        }
      }
    ]
  },
  {
    id: 'emotional-intelligence',
    title: 'Emotional Intelligence Assessment',
    description: 'Measure your ability to understand and manage emotions effectively.',
    estimatedTime: 20,
    category: 'emotional',
    questions: [
      {
        id: 'ei-1',
        text: 'How would you respond to a colleague who is visibly upset about a work situation?',
        type: 'single',
        options: [
          { id: 'a', text: 'Give them space and wait for them to approach you', value: 1 },
          { id: 'b', text: 'Immediately try to solve their problem', value: 2 },
          { id: 'c', text: 'Listen actively and show empathy', value: 3 },
          { id: 'd', text: 'Tell them to stay professional and focus on work', value: 4 }
        ]
      },
      {
        id: 'ei-2',
        text: 'When faced with a challenging situation at work, I typically:',
        type: 'single',
        options: [
          { id: 'a', text: 'React immediately based on my emotions', value: 1 },
          { id: 'b', text: 'Take time to process my feelings before responding', value: 2 },
          { id: 'c', text: 'Analyze the situation objectively', value: 3 },
          { id: 'd', text: 'Seek advice from others', value: 4 }
        ]
      },
      {
        id: 'ei-3',
        text: 'I am aware of how my emotions affect my behavior',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Rarely',
          maxLabel: 'Always'
        }
      },
      {
        id: 'ei-4',
        text: 'I can accurately identify others\' emotions',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Rarely',
          maxLabel: 'Always'
        }
      },
      {
        id: 'ei-5',
        text: 'I can regulate my emotions effectively',
        type: 'scale',
        scaleRange: {
          min: 1,
          max: 5,
          minLabel: 'Rarely',
          maxLabel: 'Always'
        }
      }
    ]
  }
];