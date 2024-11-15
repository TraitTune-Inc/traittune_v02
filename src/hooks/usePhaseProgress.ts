import { useState, useRef, useCallback } from 'react';

export function usePhaseProgress() {
  const [currentPhase, setCurrentPhase] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const slowProgressInterval = useRef<NodeJS.Timeout | null>(null);

  const resetProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (slowProgressInterval.current) {
      clearInterval(slowProgressInterval.current);
    }
    setProgress(0);
    setCurrentPhase('');
  }, []);

  const startPhase = useCallback((phaseName: string) => {
    setCurrentPhase(phaseName);
    setProgress(0);

    // Clear any existing intervals
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (slowProgressInterval.current) {
      clearInterval(slowProgressInterval.current);
    }

    // Start main progress animation
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          // Start slow progress when reaching 90%
          if (!slowProgressInterval.current) {
            slowProgressInterval.current = setInterval(() => {
              setProgress(prev => {
                if (prev >= 99.5) return prev;
                return prev + 0.1; // Very slow increment
              });
            }, 500);
          }
          return prev;
        }
        return prev + 2;
      });
    }, 100);
  }, []);

  const completePhase = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (slowProgressInterval.current) {
      clearInterval(slowProgressInterval.current);
    }
    setProgress(100);
  }, []);

  return {
    currentPhase,
    progress,
    startPhase,
    completePhase,
    resetProgress
  };
}