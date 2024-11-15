import { useState, useEffect, useRef } from 'react';

interface LoadingPhase {
  name: string;
  duration: number;
  weight: number;
}

interface UseLoadingProgressOptions {
  phases: LoadingPhase[];
}

export function useLoadingProgress({ phases }: UseLoadingProgressOptions) {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const startProgress = () => {
    setIsActive(true);
    setProgress(0);

    let accumulatedProgress = 0;
    timeoutRefs.current = [];

    phases.forEach((phase, index) => {
      const previousPhases = phases.slice(0, index);
      const startProgress = previousPhases.reduce((acc, p) => acc + (p.weight * 100), 0);
      const endProgress = startProgress + (phase.weight * 100);
      
      // Calculate steps for smooth animation
      const steps = Math.floor(phase.duration / 50); // Update every 50ms
      const progressPerStep = (endProgress - startProgress) / steps;

      for (let step = 1; step <= steps; step++) {
        const timeout = setTimeout(() => {
          if (!isActive) return;
          
          accumulatedProgress = startProgress + (progressPerStep * step);
          setProgress(Math.min(accumulatedProgress, 90)); // Never reach 100% automatically
        }, (phase.duration / steps) * step);

        timeoutRefs.current.push(timeout);
      }
    });
  };

  const completeProgress = () => {
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
      setIsActive(false);
    }, 500);
  };

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  return {
    progress,
    startProgress,
    completeProgress,
    isActive
  };
}