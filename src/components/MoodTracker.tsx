import React, { useState } from 'react';
import { ArrowLeft, Calendar, MessageCircle } from 'lucide-react';
import { dataService } from '../services/dataService';

interface MoodTrackerProps {
  onBack: () => void;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ onBack }) => {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moods = [
    { emoji: '😄', label: 'Amazing', value: 5, color: 'from-green-400 to-emerald-500' },
    { emoji: '😊', label: 'Good', value: 4, color: 'from-lime-400 to-green-500' },
    { emoji: '😐', label: 'Okay', value: 3, color: 'from-yellow-400 to-orange-500' },
    { emoji: '😟', label: 'Not Great', value: 2, color: 'from-orange-400 to-red-500' },
    { emoji: '😢', label: 'Difficult', value: 1, color: 'from-red-400 to-pink-500' }
  ];

  const handleSubmit = () => {
    if (!selectedMood) return;

    const moodValue = moods.find(m => m.emoji === selectedMood)?.value || 3;
    
    dataService.saveMoodEntry({
      mood: selectedMood,
      note: note.trim(),
      timestamp: new Date().toISOString(),
      value: moodValue
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="text-3xl">✨</div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Mood Logged!</h2>
          <p className="text-gray-600 capitalize">Thank you for checking in with yourself!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-4 capitalize">How are you feeling?</h1>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 mb-8 text-gray-600">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>

      {/* Mood Selection */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 capitalize">Select your mood</h2>
        <div className="grid grid-cols-1 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.emoji}
              onClick={() => setSelectedMood(mood.emoji)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                selectedMood === mood.emoji
                  ? `border-purple-300 bg-gradient-to-r ${mood.color} text-white shadow-lg`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{mood.emoji}</span>
                <div className="text-left">
                  <div className={`font-semibold ${
                    selectedMood === mood.emoji ? 'text-white' : 'text-gray-800'
                  }`}>
                    {mood.label}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Note Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Add a Note (Optional)</h2>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What's on your mind today? Any thoughts you'd like to capture..."
          className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-32 focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none transition-all"
          maxLength={500}
        />
        <div className="text-right text-sm text-gray-500">
          {note.length}/500
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className={`w-full py-4 rounded-2xl font-semibold transition-all ${
          selectedMood
            ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105 active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Log My Mood
      </button>
    </div>
  );
};