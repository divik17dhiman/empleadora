
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, DollarSign, Users, Trophy, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ContestCardProps {
  id: string;
  title: string;
  description: string;
  prize: number;
  deadline: string;
  timeLeft: string;
  entries: number;
  category: string;
  featured?: boolean;
}

export function ContestCard({
  id,
  title,
  description,
  prize,
  deadline,
  timeLeft,
  entries,
  category,
  featured = false
}: ContestCardProps) {
  return (
    <div 
      className={cn(
        "card-elevated rounded-xl border overflow-hidden transition-all duration-300 h-full flex flex-col",
        "hover:shadow-lg hover:translate-y-[-4px]",
        featured ? "border-primary/30 ring-1 ring-primary/20" : "border-border"
      )}
    >
      {featured && (
        <div className="bg-primary/10 text-primary text-xs font-medium text-center py-1.5">
          Featured Contest
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <span className="inline-flex py-1 px-2 rounded-full text-xs bg-secondary text-muted-foreground mb-2">
              {category}
            </span>
            <Link to={`/contest/${id}`} className="hover:text-primary transition-colors">
              <h3 className="font-medium text-lg">{title}</h3>
            </Link>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
            <Bookmark size={18} />
          </Button>
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Trophy size={16} className="mr-1 text-amber-500" />
              Prize
            </div>
            <p className="font-medium">${prize}</p>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Users size={16} className="mr-1 text-blue-500" />
              Entries
            </div>
            <p className="font-medium">{entries}</p>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock size={16} className="mr-1 text-red-500" />
              Deadline
            </div>
            <p className="font-medium">{deadline}</p>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Clock size={16} className="mr-1 text-green-600" />
              Time Left
            </div>
            <p className="font-medium">{timeLeft}</p>
          </div>
        </div>
        
        <div 
          className={cn(
            "mt-auto mb-4 w-full bg-secondary rounded-full h-2 overflow-hidden",
            timeLeft.includes("hours") ? "bg-red-100" : ""
          )}
        >
          <div 
            className={cn(
              "h-full rounded-full",
              timeLeft.includes("hours") ? "bg-red-500" : "bg-green-500"
            )}
            style={{ width: timeLeft.includes("hours") ? "85%" : "40%" }}
          ></div>
        </div>
      </div>
      
      <div className="px-6 py-3 bg-secondary/50 border-t border-border">
        <Button className="w-full rounded-full">Submit Entry</Button>
      </div>
    </div>
  );
}
