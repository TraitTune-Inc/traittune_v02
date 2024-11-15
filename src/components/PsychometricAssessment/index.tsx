import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useRequests } from '../../store/requests';
import { useAuth } from '../../lib/auth';
import { psychometricTests } from '../../data/psychometricTests';
import { PsychometricTest, TestResult } from '../../types/tests';
import { generateModuleSummary } from '../../lib/openai';
import TestSelection from './TestSelection';
import TestContainer from '../PsychometricTest/TestContainer';
import ModuleSummaryModal from '../ModuleSummaryModal';

export default function PsychometricAssessment() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { requests, updateRequest, updateRequestProgress, getTestCompletions } = useRequests();
  
  const [selectedTest, setSelectedTest] = useState<PsychometricTest | null>(null);
  const [completedTests, setCompletedTests] = useState<Array<{
    testId: string;
    completedAt: number;
  }>>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');

  const currentRequest = requests.find(r => r.id === requestId);

  useEffect(() => {
    if (!requestId || !currentRequest) {
      navigate('/');
      return;
    }

    // Load test completions from both request and user history
    const requestCompletions = currentRequest.moduleData.module3?.testResults?.map(result => ({
      testId: result.testId,
      completedAt: result.completedAt || Date.now()
    })) || [];

    const userCompletions = user ? getTestCompletions(user.id) : [];
    
    // Combine and deduplicate completions
    const allCompletions = [...requestCompletions];
    userCompletions.forEach(completion => {
      if (!allCompletions.some(c => c.testId === completion.testId)) {
        allCompletions.push({
          testId: completion.testId,
          completedAt: completion.completedAt
        });
      }
    });

    setCompletedTests(allCompletions);
    updateRequestProgress(requestId, 3, location.pathname);
  }, [requestId, currentRequest, user, location.pathname, navigate, updateRequestProgress, getTestCompletions]);

  const handleTestComplete = async (result: TestResult) => {
    if (!requestId || !currentRequest) return;

    try {
      // Get existing test results and update/add the new one
      const existingResults = currentRequest.moduleData.module3?.testResults || [];
      const updatedResults = [
        ...existingResults.filter(t => t.testId !== result.testId),
        result
      ];

      const updatedRequest = {
        ...currentRequest,
        moduleData: {
          ...currentRequest.moduleData,
          module3: {
            ...currentRequest.moduleData.module3,
            testResults: updatedResults
          }
        }
      };

      await updateRequest(updatedRequest);

      // Update local state
      setCompletedTests(prev => [
        ...prev.filter(c => c.testId !== result.testId),
        { testId: result.testId, completedAt: result.completedAt }
      ]);

      // Return to test selection view
      setSelectedTest(null);
    } catch (error) {
      console.error('Error updating test results:', error);
    }
  };

  const handleCompleteAssessment = async () => {
    if (!requestId || !currentRequest || isGenerating) return;

    try {
      setIsGenerating(true);
      setShowSummary(true);

      const testResults = currentRequest.moduleData.module3?.testResults || [];
      const testSummary = await generateModuleSummary(testResults, 3, currentRequest.type);

      const updatedRequest = {
        ...currentRequest,
        moduleData: {
          ...currentRequest.moduleData,
          module3: {
            testResults,
            summary: testSummary
          }
        }
      };

      await updateRequest(updatedRequest);
      setSummary(testSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummaryClose = () => {
    setShowSummary(false);
    if (requestId) {
      const nextPath = `/module4/${requestId}`;
      updateRequestProgress(requestId, 4, nextPath);
      navigate(nextPath);
    }
  };

  const handleRetake = (test: PsychometricTest) => {
    setSelectedTest(test);
  };

  if (!currentRequest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Request not found</h2>
          <p className="mt-2 text-gray-600">
            The request you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const allTestsCompleted = psychometricTests.every(test =>
    completedTests.some(ct => ct.testId === test.id)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ModuleSummaryModal
        isOpen={showSummary}
        onClose={handleSummaryClose}
        summary={summary}
        moduleNumber={3}
        nextAction={{
          label: 'Continue to Additional Assessment',
          onClick: handleSummaryClose
        }}
        isGenerating={isGenerating}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Psychometric Assessment</h1>
        <p className="mt-2 text-sm text-gray-600">
          Complete the following assessments to proceed with your request.
        </p>
      </div>

      {selectedTest ? (
        <TestContainer test={selectedTest} onComplete={handleTestComplete} />
      ) : (
        <TestSelection 
          tests={psychometricTests}
          completedTests={completedTests}
          onSelect={setSelectedTest}
          onRetake={handleRetake}
          onComplete={handleCompleteAssessment}
          allTestsCompleted={allTestsCompleted}
        />
      )}
    </div>
  );
}