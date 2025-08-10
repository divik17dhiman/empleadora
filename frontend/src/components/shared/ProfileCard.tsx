
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Bookmark, MessageSquare, Clock, ExternalLink, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useSavedProfiles } from '@/context/SavedProfilesContext';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  id: string;
  name: string;
  avatar: string;
  title: string;
  rating: number;
  reviewCount: number;
  location: string;
  hourlyRate: number;
  tags: string[];
  featured?: boolean;
  description?: string;
  portfolio?: string;
  email?: string;
  phone?: string;
  experience?: string;
  languages?: string[];
  availability?: string;
  completedProjects?: number;
  responseTime?: string;
}

export function ProfileCard({ 
  id, 
  name, 
  avatar, 
  title, 
  rating, 
  reviewCount, 
  location, 
  hourlyRate, 
  tags, 
  featured = false,
  description,
  portfolio,
  email,
  phone,
  experience,
  languages,
  availability,
  completedProjects,
  responseTime
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { saveProfile, removeProfile, isSaved } = useSavedProfiles();
  const saved = isSaved(id);
  
  const handleTagClick = (tag: string) => {
    // In a real app, this would navigate to search results filtered by tag
    navigate(`/freelancers?tag=${encodeURIComponent(tag)}`);
    toast({
      title: 'Filtering by tag',
      description: `Showing freelancers with "${tag}" skills`
    });
  };
  
  const handleSave = () => {
    if (saved) {
      removeProfile(id);
      toast({
        title: 'Profile removed',
        description: `${name} has been removed from your saved profiles.`
      });
    } else {
      saveProfile({ id, name, avatar, title });
      toast({
        title: 'Profile saved',
        description: `${name} has been added to your saved profiles.`
      });
    }
  };
  
  const handleContact = () => {
    navigate(`/contact/${id}`);
    toast({
      title: 'Contact initiated',
      description: `You can now message ${name}.`
    });
  };
  
  const handleHire = () => {
    navigate(`/profile/${id}`);
    toast({
      title: 'Hire process started',
      description: `Continue to hire ${name}.`
    });
  };

  const handlePortfolio = () => {
    if (portfolio) {
      window.open(portfolio, '_blank');
    }
  };

  const handleEmail = () => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  const handlePhone = () => {
    if (phone) {
      window.open(`tel:${phone}`, '_blank');
    }
  };
  
  return (
    <div 
      className={cn(
        "card-elevated rounded-xl border overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:translate-y-[-4px]",
        featured ? "border-primary/30 ring-1 ring-primary/20" : "border-border"
      )}
    >
      {featured && (
        <div className="bg-primary/10 text-primary text-xs font-medium text-center py-1.5">
          Featured Freelancer
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Link to={`/profile/${id}`} className="shrink-0">
            <img 
              src={avatar} 
              alt={name} 
              className="w-16 h-16 rounded-full object-cover subtle-shadow"
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to={`/profile/${id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-medium text-lg truncate">{name}</h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-1">{title}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "text-muted-foreground",
                  saved && "text-primary hover:text-primary"
                )}
                onClick={handleSave}
              >
                <Bookmark size={18} className={saved ? "fill-current" : ""} />
              </Button>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <div className="flex items-center mr-3">
                <Star size={16} className="text-amber-500 mr-1" />
                <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                <span className="mx-1">({reviewCount})</span>
              </div>
              <div className="flex items-center">
                <MapPin size={14} className="mr-1" />
                {location}
              </div>
            </div>

            {/* Additional Info Row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              {experience && (
                <div className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  {experience}
                </div>
              )}
              {completedProjects && (
                <div>
                  {completedProjects} projects completed
                </div>
              )}
              {responseTime && (
                <div>
                  Responds in {responseTime}
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {description}
              </p>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-muted-foreground">Hourly Rate</span>
                <p className="font-semibold">₹{hourlyRate.toLocaleString()}/hr</p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-full h-9"
                  onClick={handleContact}
                >
                  <MessageSquare size={16} className="mr-1" />
                  Contact
                </Button>
                <Button 
                  size="sm" 
                  className="rounded-full h-9"
                  onClick={handleHire}
                >
                  Hire
                </Button>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex gap-2 mb-4">
              {portfolio && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-3 text-xs"
                  onClick={handlePortfolio}
                >
                  <ExternalLink size={14} className="mr-1" />
                  Portfolio
                </Button>
              )}
              {email && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-3 text-xs"
                  onClick={handleEmail}
                >
                  <Mail size={14} className="mr-1" />
                  Email
                </Button>
              )}
              {phone && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-3 text-xs"
                  onClick={handlePhone}
                >
                  <Phone size={14} className="mr-1" />
                  Call
                </Button>
              )}
            </div>

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-muted-foreground">Languages: </span>
                <span className="text-xs">{languages.join(', ')}</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
