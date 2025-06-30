import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit3, Calendar, Search, X } from 'lucide-react';
import { dataService, type JournalEntry } from '../services/dataService';

interface JournalProps {
  onBack: () => void;
}

export const Journal: React.FC<JournalProps> = ({ onBack }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletedEntry, setDeletedEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const journalEntries = dataService.getJournalEntries();
    setEntries(journalEntries.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const saveEntry = () => {
    if (!title.trim() || !content.trim()) return;

    const entryData = editingEntry 
      ? { ...editingEntry, title: title.trim(), content: content.trim() }
      : { title: title.trim(), content: content.trim(), timestamp: new Date().toISOString() };

    dataService.saveJournalEntry(entryData);
    
    setTitle('');
    setContent('');
    setIsWriting(false);
    setEditingEntry(null);
    loadEntries();
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setIsWriting(true);
  };

  const cancelWriting = () => {
    setTitle('');
    setContent('');
    setIsWriting(false);
    setEditingEntry(null);
  };

  const deleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const entryToDelete = entries.find(e => e.id === id);
    if (entryToDelete) {
      setDeletedEntry(entryToDelete);
      dataService.deleteJournalEntry(id);
      loadEntries();
      
      setTimeout(() => {
        if (deletedEntry?.id === id) {
          setDeletedEntry(null);
        }
      }, 5000);
    }
  };

  const undoDelete = () => {
    if (deletedEntry) {
      dataService.saveJournalEntry(deletedEntry);
      setDeletedEntry(null);
      loadEntries();
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const journalPrompts = [
    "Reflect on your day by sharing: What brought you joy, what challenged you, what you learned, and how you grew, what moments made you proud, grateful, or excited for tomorrow?"
  ];

  const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];

  if (isWriting) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={cancelWriting} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex gap-2">
            {editingEntry && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this entry?')) {
                    dataService.deleteJournalEntry(editingEntry.id);
                    cancelWriting();
                    loadEntries();
                  }
                }}
                className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              onClick={saveEntry}
              disabled={!title.trim() || !content.trim()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                title.trim() && content.trim()
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="w-full p-4 text-lg font-semibold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
          />

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm text-blue-700 mb-2">💡 Today's Prompt:</p>
            <p className="text-blue-800 font-medium">{randomPrompt}</p>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind today? Let your thoughts flow..."
            className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-80 focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
          />

          <div className="text-right text-sm text-gray-500">
            {content.length} Characters
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Journal</h1>
        </div>
        <button
          onClick={() => setIsWriting(true)}
          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your entries..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-300 focus:border-transparent outline-none"
        />
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit3 className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No matching entries' : 'Start Your First Entry'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Capture Your Thoughts, Feelings, & Reflections'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsWriting(true)}
                className="bg-gradient-to-r from-purple-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all"
              >
                Write First Entry
              </button>
            )}
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => startEditing(entry)}
              className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all cursor-pointer group relative"
            >
              <button
                onClick={(e) => deleteEntry(entry.id, e)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Delete entry"
              >
                <X className="w-3 h-3" />
              </button>
              
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 flex-1 pr-2 line-clamp-1">
                  {entry.title}
                </h3>
                <Edit3 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {entry.content}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(entry.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Undo Notification */}
      {deletedEntry && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg z-10">
          <span>Entry deleted</span>
          <button 
            onClick={undoDelete}
            className="font-medium underline"
          >
            Undo
          </button>
        </div>
      )}
    </div>
  );
};