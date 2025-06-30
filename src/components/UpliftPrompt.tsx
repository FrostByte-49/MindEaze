import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Heart, Star, Lightbulb } from 'lucide-react';
import { dataService } from '../services/dataService';

interface UpliftPromptProps {
  onBack: () => void;
}

export const UpliftPrompt: React.FC<UpliftPromptProps> = ({ onBack }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const prompts = [
    {
      type: 'affirmation',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      title: 'Daily Affirmation',
      content: 'You are capable of amazing things. Your potential is limitless, and every small step forward is progress worth celebrating.',
    },
    {
      type: 'gratitude',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      title: 'Gratitude Reminder',
      content: 'Take a moment to appreciate three things in your life right now - they can be as simple as a warm cup of coffee or a friend\'s smile.',
    },
    {
      type: 'motivation',
      icon: Lightbulb,
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      title: 'Motivation Boost',
      content: 'Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown. Don\'t give up on your journey.',
    },
    {
      type: 'mindfulness',
      icon: Heart,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      title: 'Mindfulness Moment',
      content: 'Right now, take three deep breaths. Feel your feet on the ground. You are here, you are present, and that\'s enough.',
    },
    {
      type: 'self-care',
      icon: Star,
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      title: 'Self-Care Reminder',
      content: 'It\'s okay to rest. It\'s okay to say no. It\'s okay to put yourself first sometimes. You deserve kindness, especially from yourself.',
    },
    {
      type: 'growth',
      icon: Lightbulb,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      title: 'Growth Mindset',
      content: 'Challenges are not roadblocks, they\'re stepping stones. Every difficulty you overcome makes you stronger and wiser.',
    },
    {
      type: 'confidence',
      icon: Heart,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      title: 'Confidence Builder',
      content: 'You have survived 100% of your difficult days. You are more resilient than you know and braver than you feel.',
    },
    {
      type: 'peace',
      icon: Star,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      title: 'Inner Peace',
      content: 'Peace begins with you. When you find calm within yourself, you bring that serenity to everything you touch.',
    },
    {
      type: 'hope',
      icon: Lightbulb,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      title: 'Hope & Optimism',
      content: 'Tomorrow brings new possibilities. Today\'s struggles are temporary, but your strength and potential are permanent.',
    },
    {
      type: 'achievement',
      icon: Heart,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      title: 'Celebrate Yourself',
      content: 'Look how far you\'ve come! Remember to celebrate your progress, no matter how small. You\'re doing better than you think.',
    },
    {
      type: 'student-focused',
      icon: Star,
      color: 'from-blue-500 to-green-500',
      bgColor: 'bg-blue-50',
      title: 'Student Inspiration',
      content: 'Your education is an investment in yourself. Every lecture attended, every assignment completed, every challenge faced is building your future.',
    },
    {
      type: 'stress-relief',
      icon: Lightbulb,
      color: 'from-pink-500 to-purple-500',
      bgColor: 'bg-pink-50',
      title: 'Stress Relief',
      content: 'It\'s okay to feel overwhelmed sometimes. Take things one step at a time. You don\'t have to have it all figured out right now.',
    },
    {
      type: 'friendship',
      icon: Heart,
      color: 'from-emerald-500 to-blue-500',
      bgColor: 'bg-emerald-50',
      title: 'Connection',
      content: 'Reach out to someone today. A simple "how are you?" can brighten someone\'s day and strengthen your bond.',
    },
    {
      type: 'balance',
      icon: Star,
      color: 'from-orange-500 to-pink-500',
      bgColor: 'bg-orange-50',
      title: 'Life Balance',
      content: 'Balance isn\'t about perfect time management. It\'s about making conscious choices that align with your values and well-being.',
    },
    {
      type: 'creativity',
      icon: Lightbulb,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      title: 'Creative Energy',
      content: 'Your unique perspective matters. Don\'t be afraid to share your ideas and creativity with the world - it needs what you have to offer.',
    }
  ];

  useEffect(() => {
    generateNewPrompt();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewPrompt = () => {
    setIsLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
      setCurrentPrompt(randomPrompt);
      setIsLoading(false);
    }, 500);
  };

  const savePrompt = () => {
    if (!currentPrompt) return;
    
    dataService.saveUpliftPrompt({
      type: currentPrompt.type,
      title: currentPrompt.title,
      content: currentPrompt.content,
      savedAt: new Date().toISOString()
    });
    
    // Show feedback
    const button = document.getElementById('save-button');
    if (button) {
      button.textContent = 'Saved! ✨';
      button.className = button.className.replace('bg-gray-200', 'bg-green-200');
      setTimeout(() => {
        button.textContent = 'Save This';
        button.className = button.className.replace('bg-green-200', 'bg-gray-200');
      }, 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Daily Uplift</h1>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!currentPrompt) return null;

  const Icon = currentPrompt.icon;

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Daily Uplift</h1>
        </div>
        <button
          onClick={generateNewPrompt}
          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Main Prompt Card */}
      <div className={`${currentPrompt.bgColor} rounded-3xl p-8 mb-8 border-2 border-gray-100`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 bg-gradient-to-r ${currentPrompt.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {currentPrompt.title}
          </h2>
        </div>
        
        <p className="text-gray-700 leading-relaxed text-center text-lg">
          {currentPrompt.content}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={generateNewPrompt}
          className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-emerald-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          New Inspiration
        </button>
        
        <button
          id="save-button"
          onClick={savePrompt}
          className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-colors"
        >
          Save This
        </button>
      </div>

      {/* Tips */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Make it Personal</h3>
          <p className="text-sm text-gray-600">
            Take a moment to really absorb this message. How does it apply to your life right now?
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">📝 Journal About It</h3>
          <p className="text-sm text-gray-600">
            Consider writing about how this prompt makes you feel or what it reminds you of.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">🤝 Share the Positivity</h3>
          <p className="text-sm text-gray-600">
            Share an uplifting message with someone who might need it today.
          </p>
        </div>
      </div>
    </div>
  );
};