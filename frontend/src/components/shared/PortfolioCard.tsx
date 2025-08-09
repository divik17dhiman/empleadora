import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Heart, Eye } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  projectUrl?: string;
  likes: number;
  views: number;
  client: string;
  completedDate: string;
}

interface PortfolioCardProps extends PortfolioItem {
  onLike?: (id: string) => void;
  isLiked?: boolean;
}

export function PortfolioCard({
  id,
  title,
  description,
  image,
  category,
  tags,
  projectUrl,
  likes,
  views,
  client,
  completedDate,
  onLike,
  isLiked = false
}: PortfolioCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-secondary">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Action buttons on hover */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full shadow-lg h-8 w-8"
            onClick={() => onLike?.(id)}
          >
            <Heart 
              size={14} 
              className={isLiked ? "fill-red-500 text-red-500" : ""} 
            />
          </Button>
          {projectUrl && (
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full shadow-lg h-8 w-8"
              onClick={() => window.open(projectUrl, '_blank')}
            >
              <ExternalLink size={14} />
            </Button>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-foreground">
            {category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>
        
        {/* Client and date */}
        <div className="text-xs text-muted-foreground mb-3">
          <span>For {client}</span> • <span>{completedDate}</span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs px-2 py-0.5"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart size={12} />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{views}</span>
            </div>
          </div>
          
          {projectUrl && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={() => window.open(projectUrl, '_blank')}
            >
              View Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
