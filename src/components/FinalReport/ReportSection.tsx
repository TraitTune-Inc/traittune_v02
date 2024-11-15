import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';

interface ReportSectionProps {
  title: string;
  content: string;
  isMain?: boolean;
  onReview?: () => void;
  actionButton?: React.ReactNode;
  renderContent?: (content: string) => React.ReactNode;
}

export default function ReportSection({ 
  title, 
  content,
  isMain = false,
  onReview,
  actionButton,
  renderContent
}: ReportSectionProps) {
  const [isExpanded, setIsExpanded] = useState(isMain);

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${
      isMain ? 'border-2 border-indigo-600' : ''
    }`}>
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center flex-1 text-left"
        >
          <h2 className={`font-medium ${
            isMain ? 'text-lg text-indigo-600' : 'text-gray-900'
          }`}>
            {title}
          </h2>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400 ml-2" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 ml-2" />
          )}
        </button>

        <div className="flex items-center gap-4">
          {actionButton}
          
          {onReview && (
            <button
              onClick={onReview}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Review
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-4">
          <div className="prose prose-sm max-w-none">
            {renderContent ? renderContent(content) : (
              <p className="text-gray-600 whitespace-pre-wrap">{content}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}