
import React from 'react';
import { useUserMode } from '@/context/UserModeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Briefcase, UserRound } from 'lucide-react';

export function ModeToggle() {
  const { mode, toggleMode } = useUserMode();
  
  return (
    <div className="inline-flex items-center rounded-full p-1 bg-secondary">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => mode !== 'client' && toggleMode()}
        className={cn(
          "relative rounded-full px-3 text-sm font-medium transition-all duration-300 flex items-center gap-2",
          mode === 'client' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <UserRound size={16} />
        <span>Client</span>
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => mode !== 'freelancer' && toggleMode()}
        className={cn(
          "relative rounded-full px-3 text-sm font-medium transition-all duration-300 flex items-center gap-2",
          mode === 'freelancer' ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Briefcase size={16} />
        <span>Freelancer</span>
      </Button>
    </div>
  );
}
