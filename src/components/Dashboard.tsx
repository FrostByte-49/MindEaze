/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Heart, BookOpen, Wind, TrendingUp, Sparkles, Award, Music } from 'lucide-react';
import type { View } from '../App';

interface DashboardProps {
  onNavigate: (view: View) => void;
  userStats: {
    totalMoodEntries: number;
    totalJournalEntries: number;
    currentStreak: number;
    averageMood: number;
    lastMoodEntry: any;
    lastJournalEntry: any;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userStats }) => {
  const features = [
    {
      id: 'mood' as View,
      title: 'Track Mood',
      description: 'how you\'re feeling',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'journal' as View,
      title: 'Journal',
      description: 'Whispers of Me',
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'breathe' as View,
      title: 'Breathe',
      description: 'Calm your mind',
      icon: Wind,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'music' as View,
      title: 'Lofi Music',
      description: 'Relax with music',
      icon: Music,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200'
    },
    {
      id: 'chart' as View,
      title: 'Mood Trends',
      description: 'Visualize your progress',
      icon: TrendingUp,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-purple-500 to-emerald-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-purple-100 mb-4 capitalize">
          Take a moment to check in with yourself today...
        </p>
        <button
          onClick={() => onNavigate('prompt')}
          className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white font-medium hover:bg-white/30 transition-colors"
        >
          Get Daily Inspiration
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{userStats.currentStreak}</div>
            <div className="text-xs text-gray-600 mt-1">Day Streak</div>
            <Award className="w-4 h-4 text-orange-500 mx-auto mt-2" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{userStats.totalMoodEntries}</div>
            <div className="text-xs text-gray-600 mt-1">Mood Logs</div>
            <Heart className="w-4 h-4 text-pink-500 mx-auto mt-2" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{userStats.totalJournalEntries}</div>
            <div className="text-xs text-gray-600 mt-1">Entries</div>
            <BookOpen className="w-4 h-4 text-blue-500 mx-auto mt-2" />
          </div>
        </div>
      </div>

      {/* Recent Mood */}
      {userStats.lastMoodEntry && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Recent Mood</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{userStats.lastMoodEntry.mood}</span>
            <span className="text-gray-600 capitalize">How you felt recently!</span>
          </div>
        </div>
      )}

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <button
              key={feature.id}
              onClick={() => onNavigate(feature.id)}
              className={`${feature.bgColor} ${feature.borderColor} border p-6 rounded-2xl transition-all hover:scale-105 hover:shadow-lg active:scale-95`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800 text-center mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 text-center capitalize">
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};