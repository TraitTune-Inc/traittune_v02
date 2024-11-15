import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useRequests } from '../../store/requests';
import { generateModuleSummary } from '../../lib/openai';
import ModuleSummaryModal from '../ModuleSummaryModal';
import AdditionalQuestionnaire from './AdditionalQuestionnaire';
import FileUploadSection from './FileUploadSection';
import { extractTextFromPDF } from '../../lib/documentScanner';

export default function AdditionalAssessment() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { requests, updateRequest, updateRequestProgress } = useRequests();
  
  const [showSummary, setShowSummary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState('');
  const [formData, setFormData] = useState({
    answers: {},
    files: []
  });

  const currentRequest = requests.find(r => r.id === requestId);

  useEffect(() => {
    if (!requestId || !currentRequest) {
      navigate('/');
      return;
    }

    // Load existing data if available
    if (currentRequest?.moduleData.module4) {
      setFormData({
        answers: currentRequest.moduleData.module4.answers || {},
        files: currentRequest.moduleData.module4.files || []
      });
    }

    // Update request progress
    updateRequestProgress(requestId, 4, location.pathname);
  }, [requestId, currentRequest, location.pathname, navigate, updateRequestProgress]);

  const handleSubmit = async () => {
    if (!requestId || !currentRequest) return;

    try {
      setIsGenerating(true);
      setShowSummary(true);

      // Process PDF files first
      const processedDocuments = await Promise.all(
        formData.files.map(async (doc) => {
          if (doc.file && doc.file.type === 'application/pdf') {
            const text = await extractTextFromPDF(doc.file);
            return {
              type: 'file',
              value: doc.name,
              content: text,
              size: doc.size
            };
          }
          return {
            type: 'file',
            value: doc.name,
            size: doc.size
          };
        })
      );

      // Prepare data for summary generation
      const moduleData = {
        answers: formData.answers,
        documents: processedDocuments
      };

      // Generate summary
      const moduleSummary = await generateModuleSummary(moduleData, 4);
      setSummary(moduleSummary);

      // Update request with new data
      await updateRequest({
        ...currentRequest,
        moduleData: {
          ...currentRequest.moduleData,
          module4: {
            answers: formData.answers,
            files: formData.files,
            summary: moduleSummary
          }
        }
      });

    } catch (error) {
      console.error('Error processing assessment:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummaryClose = () => {
    setShowSummary(false);
    if (requestId) {
      const nextPath = `/report/${requestId}`;
      updateRequestProgress(requestId, 5, nextPath);
      navigate(nextPath);
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ModuleSummaryModal
        isOpen={showSummary}
        onClose={handleSummaryClose}
        summary={summary}
        moduleNumber={4}
        nextAction={{
          label: 'Continue to Final Report',
          onClick: handleSummaryClose
        }}
        isGenerating={isGenerating}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Additional Assessment</h1>
        <p className="mt-2 text-sm text-gray-600">
          Please provide additional information and supporting documents to enhance your assessment.
        </p>
      </div>

      <div className="space-y-8">
        <AdditionalQuestionnaire
          answers={formData.answers}
          onUpdate={(answers) => setFormData(prev => ({ ...prev, answers }))}
        />

        <FileUploadSection
          files={formData.files}
          onUpdate={(files) => setFormData(prev => ({ ...prev, files }))}
        />

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Processing...' : 'Complete Assessment'}
          </button>
        </div>
      </div>
    </div>
  );
}