import React from 'react';
import QuestionInput from '../NewRequest/QuestionInput';

const additionalQuestions = [
  {
    id: 'learningStyle',
    header: 'Learning Style',
    description: 'How do you prefer to learn and process new information?',
    type: 'textarea',
    maxLength: 300
  },
  {
    id: 'workPreferences',
    header: 'Work Environment Preferences',
    description: 'Describe your ideal work environment and conditions.',
    type: 'textarea',
    maxLength: 300
  },
  {
    id: 'challenges',
    header: 'Current Challenges',
    description: 'What specific challenges are you currently facing in your role?',
    type: 'textarea',
    maxLength: 300
  },
  {
    id: 'goals',
    header: 'Future Goals',
    description: 'What are your professional goals for the next 2-5 years?',
    type: 'textarea',
    maxLength: 300
  }
];

interface AdditionalQuestionnaireProps {
  answers: Record<string, string>;
  onUpdate: (answers: Record<string, string>) => void;
}

export default function AdditionalQuestionnaire({ 
  answers, 
  onUpdate 
}: AdditionalQuestionnaireProps) {
  const handleChange = (id: string, value: string) => {
    onUpdate({ ...answers, [id]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Additional Questions</h2>
      <div className="space-y-8">
        {additionalQuestions.map((question) => (
          <QuestionInput
            key={question.id}
            {...question}
            value={answers[question.id] || ''}
            onChange={handleChange}
            hasError={false}
          />
        ))}
      </div>
    </div>
  );
}