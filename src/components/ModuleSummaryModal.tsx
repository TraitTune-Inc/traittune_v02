import React, { useState, useEffect } from 'react';
import { X, Copy, ChevronRight, Share2, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { usePhaseProgress } from '../hooks/usePhaseProgress';

interface ModuleSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
  moduleNumber: number;
  nextAction?: {
    label: string;
    onClick: () => void;
  };
  isGenerating?: boolean;
}

const getModuleName = (moduleNumber: number): string => {
  switch (moduleNumber) {
    case 2:
      return 'Initial Assessment';
    case 3:
      return 'Psychometric Assessment';
    case 4:
      return 'Additional Assessment';
    case 5:
      return 'Final Report';
    default:
      return `Module ${moduleNumber}`;
  }
};

export default function ModuleSummaryModal({ 
  isOpen, 
  onClose, 
  summary,
  moduleNumber,
  nextAction,
  isGenerating = false
}: ModuleSummaryModalProps) {
  const [copied, setCopied] = useState(false);
  const { 
    currentPhase,
    progress,
    startPhase,
    completePhase,
    resetProgress
  } = usePhaseProgress();

  useEffect(() => {
    if (isGenerating) {
      resetProgress();
      startPhase(`Analyzing ${getModuleName(moduleNumber)} data`);
    }
  }, [isGenerating, moduleNumber, startPhase, resetProgress]);

  useEffect(() => {
    if (summary && isGenerating) {
      completePhase();
    }
  }, [summary, isGenerating, completePhase]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              onClick={onClose}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {getModuleName(moduleNumber)} Summary
            </h3>

            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative h-16 w-16">
                  {/* Circular progress track */}
                  <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                  {/* Animated progress circle */}
                  <svg className="absolute inset-0 h-full w-full -rotate-90 transform">
                    <circle
                      className="transition-all duration-300 ease-in-out"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="transparent"
                      r="30"
                      cx="32"
                      cy="32"
                      style={{
                        strokeDasharray: '188.5',
                        strokeDashoffset: 188.5 - (188.5 * progress) / 100,
                        color: progress === 100 ? '#059669' : '#4F46E5'
                      }}
                    />
                  </svg>
                  {/* Progress text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-900">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-center text-sm text-gray-600">{currentPhase}</p>
              </div>
            ) : (
              <>
                <div className="prose prose-sm max-w-none max-h-[60vh] overflow-y-auto mb-6 bg-gray-50 rounded-lg p-6">
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
                    {summary}
                  </ReactMarkdown>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                        copied 
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Text
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </button>
                  </div>

                  {nextAction ? (
                    <button
                      onClick={nextAction.onClick}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                      {nextAction.label}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={onClose}
                      className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                      Continue to {getModuleName(moduleNumber + 1)}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}