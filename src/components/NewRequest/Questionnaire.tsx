import React, { useEffect, useState, useRef } from 'react';
import QuestionInput from './QuestionInput';
import { questions } from '../../data/questions';

interface QuestionnaireProps {
  requestType: string;
  answers: Record<string, any>;
  onUpdate: (answers: Record<string, any>) => void;
  onValidationChange: (isValid: boolean) => void;
}

export default function Questionnaire({ 
  requestType, 
  answers, 
  onUpdate,
  onValidationChange 
}: QuestionnaireProps) {
  const questionSet = questions[requestType];
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [showValidation, setShowValidation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (id: string, value: string) => {
    onUpdate({ ...answers, [id]: value });
    if (showValidation) {
      validateAnswers();
    }
  };

  const validateAnswers = () => {
    const newErrors: Record<string, boolean> = {};
    let hasErrors = false;

    questionSet?.questions.forEach(({ id, maxLength }) => {
      const value = answers[id] || '';
      const isExceeded = value.length > maxLength;
      newErrors[id] = isExceeded;
      if (isExceeded) hasErrors = true;
    });

    setErrors(newErrors);
    onValidationChange(!hasErrors);
    return { hasErrors, newErrors };
  };

  const scrollToFirstError = () => {
    const firstErrorId = Object.entries(errors)
      .find(([, hasError]) => hasError)?.[0];

    if (firstErrorId) {
      const errorElement = document.getElementById(`question-${firstErrorId}`);
      if (errorElement) {
        const headerOffset = 120;
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus the textarea after scrolling
        const textarea = errorElement.querySelector('textarea');
        if (textarea) {
          setTimeout(() => {
            textarea.focus();
          }, 500);
        }
      }
    }
  };

  // Expose validation method to parent
  useEffect(() => {
    const button = document.createElement('button');
    button.style.display = 'none';
    button.setAttribute('data-questionnaire-validation', 'true');
    button.onclick = () => {
      setShowValidation(true);
      const { hasErrors } = validateAnswers();
      if (hasErrors) {
        setTimeout(scrollToFirstError, 100);
      }
    };
    document.body.appendChild(button);
    return () => button.remove();
  }, [answers]);

  // Initial validation without showing errors
  useEffect(() => {
    validateAnswers();
  }, [answers]);

  if (!questionSet) {
    return null;
  }

  return (
    <div ref={containerRef} className="space-y-6">
      {showValidation && Object.values(errors).some(Boolean) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Please review your answers. Some responses exceed the character limit.
              </p>
            </div>
          </div>
        </div>
      )}
      <div>
        <h2 className="text-lg font-medium text-gray-900">{questionSet.title}</h2>
        <p className="mt-1 text-sm text-gray-600">{questionSet.description}</p>
      </div>
      <div className="space-y-8">
        {questionSet.questions.map((question) => (
          <QuestionInput
            key={question.id}
            {...question}
            value={answers[question.id] || ''}
            onChange={handleChange}
            hasError={showValidation && errors[question.id]}
          />
        ))}
      </div>
    </div>
  );
}