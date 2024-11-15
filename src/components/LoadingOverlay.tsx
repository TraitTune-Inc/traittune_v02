import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  progress?: number;
  message?: string;
}

export default function LoadingOverlay({ 
  isVisible, 
  progress = 0, 
  message = 'Processing...' 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="rounded-lg bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center">
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
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}