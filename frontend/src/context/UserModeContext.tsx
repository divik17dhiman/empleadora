
import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserMode = 'client' | 'freelancer';

interface UserModeContextType {
  mode: UserMode;
  toggleMode: () => void;
  setMode: (mode: UserMode) => void;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

export function UserModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode>('client');

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'client' ? 'freelancer' : 'client');
  };

  return (
    <UserModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
}
