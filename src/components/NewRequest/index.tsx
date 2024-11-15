import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { useRequests } from '../../store/requests';
import RequestType from './RequestType';
import Questionnaire from './Questionnaire';
import DocumentUpload from './DocumentUpload';
import AuthModal from '../AuthModal';
import ModuleSummaryModal from '../ModuleSummaryModal';
import LoadingOverlay from '../LoadingOverlay';
import { generateModuleSummary } from '../../lib/documentScanner';

const steps = ['Request Type', 'Questionnaire', 'Documents'];

export default function NewRequest() {
  const [currentStep, setCurrentStep] = useState(0);
  const [requestData, setRequestData] = useState({
    type: '',
    answers: {},
    documents: [],
  });
  const [isValid, setIsValid] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [summary, setSummary] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createRequest } = useRequests();

  const handleNext = () => {
    if (currentStep === 1 && !isValid) {
      const questionnaireEl = document.querySelector('[data-questionnaire-validation]');
      if (questionnaireEl instanceof HTMLButtonElement) {
        questionnaireEl.click();
      }
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/');
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleValidationChange = (valid: boolean) => {
    setIsValid(valid);
  };

  const updateRequestData = (data: any) => {
    setRequestData((prev) => ({ ...prev, ...data }));
  };

  const processDocuments = async () => {
    setIsProcessing(true);
    setLoadingProgress(0);

    try {
      // Simulate initial processing time
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Generate summary from questionnaire and documents
      const moduleSummary = await generateModuleSummary(
        requestData.answers,
        requestData.documents
      );

      clearInterval(progressInterval);
      setLoadingProgress(100);
      setSummary(moduleSummary);
      setShowSummaryModal(true);
    } catch (error) {
      console.error('Error processing documents:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    await processDocuments();
  };

  const handleSummaryClose = async () => {
    setShowSummaryModal(false);
    
    try {
      const request = await createRequest({
        type: requestData.type,
        userId: user!.id,
        status: 'in_progress',
        moduleData: {
          module2: {
            answers: requestData.answers,
            documents: requestData.documents,
            summary
          },
        },
      });

      // Navigate to Module 3 (Psychometric Assessment)
      navigate(`/assessment/${request.id}`);
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    // If user is now authenticated, proceed with request creation
    if (isAuthenticated) {
      handleCreateRequest();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose} 
      />
      
      <LoadingOverlay 
        isVisible={isProcessing}
        progress={loadingProgress}
        message="Processing documents and generating summary..."
      />

      <ModuleSummaryModal
        isOpen={showSummaryModal}
        onClose={handleSummaryClose}
        summary={summary}
        moduleNumber={2}
        isLoading={false}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Request</h1>
        <p className="mt-2 text-sm text-gray-600">
          Complete the following steps to create your assessment request.
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 text-sm ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {currentStep === 0 && (
          <RequestType
            selectedType={requestData.type}
            onSelect={(type) => updateRequestData({ type })}
          />
        )}
        {currentStep === 1 && (
          <Questionnaire
            requestType={requestData.type}
            answers={requestData.answers}
            onUpdate={(answers) => updateRequestData({ answers })}
            onValidationChange={handleValidationChange}
          />
        )}
        {currentStep === 2 && (
          <DocumentUpload
            documents={requestData.documents}
            onUpdate={(documents) => updateRequestData({ documents })}
          />
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>
          <button
            onClick={currentStep === steps.length - 1 ? handleCreateRequest : handleNext}
            disabled={currentStep === 0 && !requestData.type}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? 'Create Request' : 'Next'}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}