import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MoodTracker } from './components/MoodTracker';
import { Journal } from './components/Journal';
import { BreathingExercise } from './components/BreathingExercise';
import { UpliftPrompt } from './components/UpliftPrompt';
import { MoodChart } from './components/MoodChart';
import { MusicPlayer } from './components/MusicPlayer';
import { Navigation } from './components/Navigation';
import { dataService } from './services/dataService';

export type View = 'dashboard' | 'mood' | 'journal' | 'breathe' | 'chart' | 'prompt' | 'music';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [userStats, setUserStats] = useState(dataService.getUserStats());

  useEffect(() => {
    // Update stats when view changes (to reflect new data)
    setUserStats(dataService.getUserStats());
  }, [currentView]);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} userStats={userStats} />;
      case 'mood':
        return <MoodTracker onBack={() => setCurrentView('dashboard')} />;
      case 'journal':
        return <Journal onBack={() => setCurrentView('dashboard')} />;
      case 'breathe':
        return <BreathingExercise onBack={() => setCurrentView('dashboard')} />;
      case 'chart':
        return <MoodChart onBack={() => setCurrentView('dashboard')} />;
      case 'prompt':
        return <UpliftPrompt onBack={() => setCurrentView('dashboard')} />;
      case 'music':
        return <MusicPlayer onBack={() => setCurrentView('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentView} userStats={userStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-emerald-50">
      <Header />
      <main className="pb-20">
        {renderView()}
      </main>
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
    </div>
  );
}

export default App;