import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRequests } from '../../store/requests';
import { generateComprehensiveReport } from '../../lib/openai';
import LoadingOverlay from '../LoadingOverlay';
import ReportSection from './ReportSection';
import { Download, Share, RefreshCw, Check, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function FinalReport() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { requests, updateRequest } = useRequests();
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [report, setReport] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentRequest = requests.find(r => r.id === requestId);

  useEffect(() => {
    if (!requestId || !currentRequest) {
      navigate('/');
      return;
    }

    // Load existing report if available
    if (currentRequest.moduleData.module5?.report) {
      setReport(currentRequest.moduleData.module5.report);
    }
  }, [requestId, currentRequest, navigate]);

  const handleGenerateReport = async () => {
    if (!currentRequest || !currentRequest.moduleData.module4?.summary) return;

    try {
      setIsGenerating(true);
      setLoadingProgress(0);
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const comprehensiveReport = await generateComprehensiveReport(currentRequest);
      
      await updateRequest({
        ...currentRequest,
        status: 'completed',
        moduleData: {
          ...currentRequest.moduleData,
          module5: {
            report: comprehensiveReport
          }
        }
      });

      setReport(comprehensiveReport);
      clearInterval(progressInterval);
      setLoadingProgress(100);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateReport = async () => {
    if (!currentRequest) return;
    
    setIsRegenerating(true);
    try {
      const comprehensiveReport = await generateComprehensiveReport(currentRequest);
      
      await updateRequest({
        ...currentRequest,
        moduleData: {
          ...currentRequest.moduleData,
          module5: {
            report: comprehensiveReport
          }
        }
      });

      setReport(comprehensiveReport);
    } catch (error) {
      console.error('Error regenerating report:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const renderMarkdownContent = (content: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h3: ({node, ...props}) => (
          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4" {...props} />
        ),
        ul: ({node, ...props}) => (
          <ul className="space-y-2 mt-2" {...props} />
        ),
        li: ({node, ...props}) => (
          <li className="text-gray-600" {...props} />
        ),
        strong: ({node, ...props}) => (
          <strong className="font-semibold text-gray-900" {...props} />
        ),
        p: ({node, ...props}) => (
          <p className="text-gray-600 mb-4" {...props} />
        ),
        blockquote: ({node, ...props}) => (
          <blockquote className="border-l-4 border-indigo-200 pl-4 italic text-gray-600" {...props} />
        ),
        code: ({node, ...props}) => (
          <code className="bg-gray-100 rounded px-1 py-0.5 text-sm text-gray-800" {...props} />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  );

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
      <LoadingOverlay 
        isVisible={isGenerating}
        progress={loadingProgress}
        message="Generating comprehensive report..."
      />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comprehensive Assessment Report</h1>
          <p className="mt-2 text-sm text-gray-600">
            A detailed analysis of all assessment modules
          </p>
        </div>
        <div className="flex gap-4">
          {!report && (
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </button>
          )}
          {report && (
            <>
              <button
                onClick={() => window.print()}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Report URL copied to clipboard');
                }}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Report
              </button>
            </>
          )}
        </div>
      </div>

      {report ? (
        <div className="space-y-8">
          <ReportSection
            title="Initial Assessment"
            content={currentRequest.moduleData.module2?.summary || ''}
            onReview={() => navigate(`/new-request/${requestId}`)}
            renderContent={renderMarkdownContent}
          />
          
          <ReportSection
            title="Psychometric Analysis"
            content={currentRequest.moduleData.module3?.summary || ''}
            onReview={() => navigate(`/assessment/${requestId}`)}
            renderContent={renderMarkdownContent}
          />
          
          <ReportSection
            title="Additional Assessment"
            content={currentRequest.moduleData.module4?.summary || ''}
            onReview={() => navigate(`/module4/${requestId}`)}
            renderContent={renderMarkdownContent}
          />
          
          <ReportSection
            title="Comprehensive Analysis"
            content={report}
            isMain
            renderContent={renderMarkdownContent}
            actionButton={
              <button
                onClick={handleRegenerateReport}
                disabled={isRegenerating}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${isRegenerating 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
              >
                {isRegenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Regenerate Analysis
                  </>
                )}
              </button>
            }
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Report Generated</h3>
          <p className="mt-1 text-sm text-gray-500">
            Click the "Generate Report" button to create a comprehensive analysis
          </p>
        </div>
      )}
    </div>
  );
}