// Data Service for MindEase
// Handles all data persistence operations

export interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: string;
  value: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  mood?: string;
}

export interface UpliftPrompt {
  id: string;
  type: string;
  title: string;
  content: string;
  savedAt: string;
}

export interface UserSettings {
  notifications: boolean;
  reminderTime: string;
  theme: 'light' | 'dark';
  musicVolume: number;
  breathingDuration: number;
}

interface UserDataExport {
  moods?: MoodEntry[];
  journals?: JournalEntry[];
  savedPrompts?: UpliftPrompt[];
  favorites?: string[];
  settings?: UserSettings;
  exportDate?: string;
}

class DataService {
  private readonly STORAGE_KEYS = {
    MOODS: 'mindease_moods',
    JOURNALS: 'mindease_journals',
    SAVED_PROMPTS: 'mindease_saved_prompts',
    FAVORITES: 'mindease_favorites',
    SETTINGS: 'mindease_settings',
    USER_STATS: 'mindease_user_stats'
  };

  // Mood Data Operations
  saveMoodEntry(entry: Omit<MoodEntry, 'id'>): MoodEntry {
    const moodEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString()
    };

    const existingMoods = this.getMoodEntries();
    existingMoods.push(moodEntry);
    
    localStorage.setItem(this.STORAGE_KEYS.MOODS, JSON.stringify(existingMoods));
    this.updateUserStats();
    
    return moodEntry;
  }

  getMoodEntries(): MoodEntry[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.MOODS);
    return data ? JSON.parse(data) : [];
  }

  deleteMoodEntry(id: string): boolean {
    const moods = this.getMoodEntries();
    const filteredMoods = moods.filter(mood => mood.id !== id);
    
    if (filteredMoods.length !== moods.length) {
      localStorage.setItem(this.STORAGE_KEYS.MOODS, JSON.stringify(filteredMoods));
      return true;
    }
    return false;
  }

  // Journal Data Operations
  saveJournalEntry(entry: Omit<JournalEntry, 'id'> | JournalEntry): JournalEntry {
    const journalEntry: JournalEntry = {
      ...entry,
      id: 'id' in entry ? entry.id : Date.now().toString()
    };

    const existingJournals = this.getJournalEntries();
    const existingIndex = existingJournals.findIndex(j => j.id === journalEntry.id);
    
    if (existingIndex >= 0) {
      existingJournals[existingIndex] = journalEntry;
    } else {
      existingJournals.push(journalEntry);
    }
    
    localStorage.setItem(this.STORAGE_KEYS.JOURNALS, JSON.stringify(existingJournals));
    this.updateUserStats();
    
    return journalEntry;
  }

  getJournalEntries(): JournalEntry[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.JOURNALS);
    return data ? JSON.parse(data) : [];
  }

  deleteJournalEntry(id: string): boolean {
    const journals = this.getJournalEntries();
    const filteredJournals = journals.filter(journal => journal.id !== id);
    
    if (filteredJournals.length !== journals.length) {
      localStorage.setItem(this.STORAGE_KEYS.JOURNALS, JSON.stringify(filteredJournals));
      return true;
    }
    return false;
  }

  // Saved Prompts Operations
  saveUpliftPrompt(prompt: Omit<UpliftPrompt, 'id'>): UpliftPrompt {
    const savedPrompt: UpliftPrompt = {
      ...prompt,
      id: Date.now().toString()
    };

    const existingPrompts = this.getSavedPrompts();
    existingPrompts.push(savedPrompt);
    
    localStorage.setItem(this.STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(existingPrompts));
    
    return savedPrompt;
  }

  getSavedPrompts(): UpliftPrompt[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.SAVED_PROMPTS);
    return data ? JSON.parse(data) : [];
  }

  // Favorites Operations
  getFavorites(): string[] {
    const data = localStorage.getItem(this.STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  }

  toggleFavorite(id: string): boolean {
    const favorites = this.getFavorites();
    const isFavorited = favorites.includes(id);
    
    const newFavorites = isFavorited
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    
    localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(newFavorites));
    return !isFavorited;
  }

  // User Settings Operations
  getUserSettings(): UserSettings {
    const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
    const defaultSettings: UserSettings = {
      notifications: true,
      reminderTime: '20:00',
      theme: 'light',
      musicVolume: 0.7,
      breathingDuration: 3
    };
    
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  }

  updateUserSettings(settings: Partial<UserSettings>): UserSettings {
    const currentSettings = this.getUserSettings();
    const newSettings = { ...currentSettings, ...settings };
    
    localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    return newSettings;
  }

  // User Statistics
  getUserStats() {
    const moods = this.getMoodEntries();
    const journals = this.getJournalEntries();
    
    const calculateStreak = () => {
      if (moods.length === 0) return 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentStreak = 0;
      const checkDate = new Date(today);
      
      while (true) {
        const dayStr = checkDate.toDateString();
        const hasEntry = moods.some(entry => 
          new Date(entry.timestamp).toDateString() === dayStr
        );
        
        if (hasEntry) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      
      return currentStreak;
    };

    const calculateAverageMood = () => {
      if (moods.length === 0) return 0;
      const sum = moods.reduce((acc, mood) => acc + mood.value, 0);
      return sum / moods.length;
    };

    return {
      totalMoodEntries: moods.length,
      totalJournalEntries: journals.length,
      currentStreak: calculateStreak(),
      averageMood: calculateAverageMood(),
      lastMoodEntry: moods.length > 0 ? moods[moods.length - 1] : null,
      lastJournalEntry: journals.length > 0 ? journals[journals.length - 1] : null
    };
  }

  private updateUserStats() {
    const stats = this.getUserStats();
    localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify({
      ...stats,
      lastUpdated: new Date().toISOString()
    }));
  }

  // Data Export/Import for backup
  exportUserData(): UserDataExport {
    return {
      moods: this.getMoodEntries(),
      journals: this.getJournalEntries(),
      savedPrompts: this.getSavedPrompts(),
      favorites: this.getFavorites(),
      settings: this.getUserSettings(),
      exportDate: new Date().toISOString()
    };
  }

  importUserData(data: UserDataExport) {
    try {
      if (data.moods) localStorage.setItem(this.STORAGE_KEYS.MOODS, JSON.stringify(data.moods));
      if (data.journals) localStorage.setItem(this.STORAGE_KEYS.JOURNALS, JSON.stringify(data.journals));
      if (data.savedPrompts) localStorage.setItem(this.STORAGE_KEYS.SAVED_PROMPTS, JSON.stringify(data.savedPrompts));
      if (data.favorites) localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(data.favorites));
      if (data.settings) localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      
      this.updateUserStats();
      return true;
    } catch (error) {
      console.error('Failed to import user data:', error);
      return false;
    }
  }

  // Clear all data (for testing or reset)
  clearAllData() {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

// Export singleton instance
export const dataService = new DataService();