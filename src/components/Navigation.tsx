import React from 'react';
import { Home, Heart, BookOpen, Wind, Music } from 'lucide-react';
import type { View } from '../App';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard' as View, icon: Home, label: 'Home' },
    { id: 'mood' as View, icon: Heart, label: 'Mood' },
    { id: 'journal' as View, icon: BookOpen, label: 'Journal' },
    { id: 'music' as View, icon: Music, label: 'Music' },
    { id: 'breathe' as View, icon: Wind, label: 'Breathe' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-40">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-purple-600' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-purple-600' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};