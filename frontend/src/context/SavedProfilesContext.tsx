
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SavedProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
}

interface SavedProfilesContextProps {
  savedProfiles: SavedProfile[];
  saveProfile: (profile: SavedProfile) => void;
  removeProfile: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const SavedProfilesContext = createContext<SavedProfilesContextProps | undefined>(undefined);

export function SavedProfilesProvider({ children }: { children: React.ReactNode }) {
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>(() => {
    // Load saved profiles from localStorage on initial render
    const saved = localStorage.getItem('savedProfiles');
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage whenever savedProfiles changes
  useEffect(() => {
    localStorage.setItem('savedProfiles', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  const saveProfile = (profile: SavedProfile) => {
    setSavedProfiles(prev => {
      // Check if profile is already saved
      if (prev.some(p => p.id === profile.id)) {
        return prev;
      }
      return [...prev, profile];
    });
  };

  const removeProfile = (id: string) => {
    setSavedProfiles(prev => prev.filter(profile => profile.id !== id));
  };

  const isSaved = (id: string) => {
    return savedProfiles.some(profile => profile.id === id);
  };

  return (
    <SavedProfilesContext.Provider 
      value={{ 
        savedProfiles, 
        saveProfile, 
        removeProfile, 
        isSaved 
      }}
    >
      {children}
    </SavedProfilesContext.Provider>
  );
}

export function useSavedProfiles() {
  const context = useContext(SavedProfilesContext);
  if (context === undefined) {
    throw new Error('useSavedProfiles must be used within a SavedProfilesProvider');
  }
  return context;
}
