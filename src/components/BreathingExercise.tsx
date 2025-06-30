import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  onBack: () => void;
}

type BreathingType = 'box' | '478';
type Phase = 'inhale' | 'hold' | 'exhale' | 'hold2';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [breathingType, setBreathingType] = useState<BreathingType>('box');
  const [duration, setDuration] = useState(3); // minutes
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const breathingPatterns = {
    box: {
      name: 'Box Breathing',
      description: 'Equal time for each phase',
      phases: {
        inhale: 4,
        hold: 4,
        exhale: 4,
        hold2: 4
      },
      instructions: {
        inhale: 'Breathe in slowly',
        hold: 'Hold your breath',
        exhale: 'Breathe out slowly',
        hold2: 'Hold empty'
      }
    },
    '478': {
      name: '4-7-8 Breathing',
      description: 'Relaxing breath pattern',
      phases: {
        inhale: 4,
        hold: 7,
        exhale: 8,
        hold2: 0
      },
      instructions: {
        inhale: 'Breathe in through nose',
        hold: 'Hold your breath',
        exhale: 'Breathe out through mouth',
        hold2: ''
      }
    }
  };

  const currentPattern = breathingPatterns[breathingType];
  const currentPhaseDuration = currentPattern.phases[currentPhase];

  useEffect(() => {
    setTimeRemaining(duration * 60);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isActive) {
      runBreathingCycle();
    } else {
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current);
      }
    }

    return () => {
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current);
      }
    };
  }, [isActive, currentPhase, breathingType]);

  const runBreathingCycle = () => {
    setPhaseProgress(0);
    
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
    }

    const phaseDuration = currentPattern.phases[currentPhase] * 1000;
    const progressInterval = 50; // Update every 50ms for smooth animation
    
    phaseIntervalRef.current = setInterval(() => {
      setPhaseProgress(prev => {
        const newProgress = prev + (progressInterval / phaseDuration) * 100;
        
        if (newProgress >= 100) {
          // Move to next phase
          const phases: Phase[] = ['inhale', 'hold', 'exhale', 'hold2'];
          const currentIndex = phases.indexOf(currentPhase);
          let nextIndex = (currentIndex + 1) % phases.length;
          
          // Skip hold2 for 4-7-8 breathing
          if (breathingType === '478' && phases[nextIndex] === 'hold2') {
            nextIndex = (nextIndex + 1) % phases.length;
            setCycleCount(prev => prev + 1);
          } else if (phases[nextIndex] === 'inhale') {
            setCycleCount(prev => prev + 1);
          }
          
          setCurrentPhase(phases[nextIndex]);
          return 0;
        }
        
        return newProgress;
      });
    }, progressInterval);
  };

  const toggleBreathing = () => {
    setIsActive(!isActive);
  };

  const resetExercise = () => {
    setIsActive(false);
    setTimeRemaining(duration * 60);
    setCurrentPhase('inhale');
    setPhaseProgress(0);
    setCycleCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCircleScale = () => {
    if (currentPhase === 'inhale') {
      return 0.5 + (phaseProgress / 100) * 0.5; // Scale from 0.5 to 1
    } else if (currentPhase === 'exhale') {
      return 1 - (phaseProgress / 100) * 0.5; // Scale from 1 to 0.5
    }
    return currentPhase === 'hold' ? 1 : 0.5; // Hold at full or empty
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4">Breathing Exercise</h1>
      </div>

      {/* Breathing Type Selection */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {Object.entries(breathingPatterns).map(([key, pattern]) => (
          <button
            key={key}
            onClick={() => setBreathingType(key as BreathingType)}
            disabled={isActive}
            className={`p-4 rounded-2xl border-2 transition-all ${
              breathingType === key
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <h3 className="font-semibold text-gray-800 mb-1">{pattern.name}</h3>
            <p className="text-sm text-gray-600">{pattern.description}</p>
          </button>
        ))}
      </div>

      {/* Duration Selector */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">Duration</h3>
        <div className="flex gap-2 justify-center">
          {[1, 3, 5, 10].map((mins) => (
            <button
              key={mins}
              onClick={() => setDuration(mins)}
              disabled={isActive}
              className={`px-4 py-2 rounded-xl transition-colors ${
                duration === mins
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Breathing Circle */}
      <div className="relative mb-8">
        <div className="flex items-center justify-center h-80">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-64 h-64 rounded-full border-4 border-emerald-200"></div>
            
            {/* Breathing circle */}
            <div
              className="absolute inset-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-transform duration-75 ease-in-out shadow-lg"
              style={{
                transform: `scale(${getCircleScale()})`,
              }}
            ></div>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="text-lg font-semibold mb-2">
                {currentPattern.instructions[currentPhase]}
              </div>
              <div className="text-sm opacity-90">
                {currentPhaseDuration > 0 && `${currentPhaseDuration}s`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{formatTime(timeRemaining)}</div>
          <div className="text-sm text-gray-600">Time Remaining</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{cycleCount}</div>
          <div className="text-sm text-gray-600">Breathing Cycles</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={toggleBreathing}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isActive ? 'Pause' : 'Start'}
        </button>
        
        <button
          onClick={resetExercise}
          className="p-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Completion message */}
      {timeRemaining === 0 && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
          <div className="text-emerald-600 font-semibold mb-1">Session Complete! 🌟</div>
          <div className="text-sm text-emerald-700">
            Great job taking time for mindful breathing
          </div>
        </div>
      )}
    </div>
  );
};