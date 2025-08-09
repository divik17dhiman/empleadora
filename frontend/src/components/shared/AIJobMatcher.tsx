import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, Target, Clock, MapPin, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIRecommendation {
  id: string;
  title: string;
  type: 'project' | 'freelancer';
  matchScore: number;
  matchReasons: string[];
  urgency: 'low' | 'medium' | 'high';
  budget?: { min: number; max: number };
  location?: string;
  timeAgo: string;
  tags: string[];
  clientInfo?: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  freelancerInfo?: {
    name: string;
    avatar: string;
    rating: number;
    hourlyRate: number;
  };
}

interface AIJobMatcherProps {
  userType: 'client' | 'freelancer';
  userSkills?: string[];
  userLocation?: string;
  userBudget?: { min: number; max: number };
}

const sampleRecommendations: AIRecommendation[] = [
  {
    id: '1',
    title: 'React Native App for Local Grocery Delivery',
    type: 'project',
    matchScore: 95,
    matchReasons: [
      'Perfect match for React Native skills',
      'Located in your preferred city',
      'Budget aligns with your rate'
    ],
    urgency: 'high',
    budget: { min: 80000, max: 120000 },
    location: 'Mumbai',
    timeAgo: '2 hours ago',
    tags: ['React Native', 'Mobile App', 'E-commerce'],
    clientInfo: {
      name: 'FreshMart Groceries',
      avatar: 'https://images.unsplash.com/photo-1549924231-f129b911e442',
      verified: true
    }
  },
  {
    id: '2',
    title: 'UI/UX Design for FinTech Startup',
    type: 'project',
    matchScore: 88,
    matchReasons: [
      'Strong portfolio in financial apps',
      'Client prefers Hindi-speaking designers',
      'Timeline matches your availability'
    ],
    urgency: 'medium',
    budget: { min: 45000, max: 75000 },
    location: 'Remote',
    timeAgo: '5 hours ago',
    tags: ['UI/UX Design', 'FinTech', 'Mobile First'],
    clientInfo: {
      name: 'PayEasy Solutions',
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      verified: true
    }
  },
  {
    id: '3',
    title: 'Priya Sharma - Senior UI/UX Designer',
    type: 'freelancer',
    matchScore: 92,
    matchReasons: [
      'Specializes in your project type',
      'Excellent ratings and reviews',
      'Available for immediate start'
    ],
    urgency: 'medium',
    location: 'Bangalore',
    timeAgo: '1 day ago',
    tags: ['UI/UX Design', 'Mobile Apps', 'Prototyping'],
    freelancerInfo: {
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      rating: 4.9,
      hourlyRate: 1200
    }
  }
];

export function AIJobMatcher({ userType, userSkills = [], userLocation, userBudget }: AIJobMatcherProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setRecommendations(sampleRecommendations.filter(rec => 
        userType === 'freelancer' ? rec.type === 'project' : rec.type === 'freelancer'
      ));
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [userType]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-purple-500" size={20} />
            AI is analyzing perfect matches for you...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={60} className="w-full" />
            <div className="text-sm text-muted-foreground">
              Processing your profile, skills, and preferences to find the best opportunities
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Sparkles size={20} />
            AI-Powered Recommendations
          </CardTitle>
          <p className="text-sm text-purple-600">
            Based on your profile, skills, and activity, we've found {recommendations.length} perfect matches
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{rec.title}</h3>
                    <div className={cn("w-2 h-2 rounded-full", getUrgencyColor(rec.urgency))} />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    {rec.location && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        {rec.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {rec.timeAgo}
                    </div>
                    {rec.budget && (
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        ₹{rec.budget.min.toLocaleString()}-{rec.budget.max.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  getMatchScoreColor(rec.matchScore)
                )}>
                  {rec.matchScore}% match
                </div>
              </div>

              {/* Client/Freelancer Info */}
              {rec.clientInfo && (
                <div className="flex items-center gap-2 mb-3">
                  <img 
                    src={rec.clientInfo.avatar} 
                    alt={rec.clientInfo.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{rec.clientInfo.name}</span>
                  {rec.clientInfo.verified && (
                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                  )}
                </div>
              )}

              {rec.freelancerInfo && (
                <div className="flex items-center gap-2 mb-3">
                  <img 
                    src={rec.freelancerInfo.avatar} 
                    alt={rec.freelancerInfo.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{rec.freelancerInfo.name}</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>⭐ {rec.freelancerInfo.rating}</span>
                    <span>•</span>
                    <span>₹{rec.freelancerInfo.hourlyRate}/hr</span>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {rec.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Match Reasons */}
              <div className="bg-green-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="text-green-600" size={14} />
                  <span className="text-sm font-medium text-green-800">Why this is a great match:</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  {rec.matchReasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  {userType === 'freelancer' ? 'Apply Now' : 'Contact Freelancer'}
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={20} />
            <div>
              <h4 className="font-medium text-blue-800">Improve Your Match Score</h4>
              <p className="text-sm text-blue-600">
                Complete your profile and add more skills to get better AI recommendations
              </p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
