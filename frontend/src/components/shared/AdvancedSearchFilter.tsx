import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, DollarSign, Star, Users, Zap } from 'lucide-react';

interface AdvancedSearchFilterProps {
  onFilterChange: (filters: any) => void;
  filterType: 'freelancers' | 'projects';
}

const indianCities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
];

const skillCategories = {
  'Technology': ['React', 'Node.js', 'Python', 'Java', 'Flutter', 'iOS', 'Android', 'WordPress', 'Shopify'],
  'Design': ['UI/UX Design', 'Graphic Design', 'Logo Design', 'Branding', 'Figma', 'Adobe Creative Suite'],
  'Content': ['Content Writing', 'Copywriting', 'Hindi Content', 'Technical Writing', 'Blog Writing', 'SEO'],
  'Marketing': ['Digital Marketing', 'Social Media', 'SEO/SEM', 'Email Marketing', 'Influencer Marketing'],
  'Photography': ['Product Photography', 'Event Photography', 'Portrait Photography', 'Video Editing'],
  'Business': ['Data Entry', 'Virtual Assistant', 'Accounting', 'Project Management', 'Business Analysis']
};

export function AdvancedSearchFilter({ onFilterChange, filterType }: AdvancedSearchFilterProps) {
  const [filters, setFilters] = useState({
    location: '',
    skills: [] as string[],
    budget: [0, 200000],
    rating: 0,
    experience: '',
    availability: '',
    languages: [] as string[],
    projectType: '',
    verified: false,
    aiRecommended: false
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const addSkill = (skill: string) => {
    if (!filters.skills.includes(skill)) {
      updateFilters({ skills: [...filters.skills, skill] });
    }
  };

  const removeSkill = (skill: string) => {
    updateFilters({ skills: filters.skills.filter(s => s !== skill) });
  };

  const resetFilters = () => {
    const reset = {
      location: '',
      skills: [],
      budget: [0, 200000],
      rating: 0,
      experience: '',
      availability: '',
      languages: [],
      projectType: '',
      verified: false,
      aiRecommended: false
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Zap className="text-orange-500" size={16} />
            AI-Powered Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="aiRecommended"
              checked={filters.aiRecommended}
              onCheckedChange={(checked) => updateFilters({ aiRecommended: checked as boolean })}
            />
            <Label htmlFor="aiRecommended" className="text-sm">
              Show AI recommended matches
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified"
              checked={filters.verified}
              onCheckedChange={(checked) => updateFilters({ verified: checked as boolean })}
            />
            <Label htmlFor="verified" className="text-sm">
              KYC verified profiles only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="any">Any Location</SelectItem>
              {indianCities.map(city => (
                <SelectItem key={city} value={city.toLowerCase()}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Users size={16} />
            Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Browse by category" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(skillCategories).map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedCategory && (
            <div className="grid grid-cols-2 gap-2">
              {skillCategories[selectedCategory as keyof typeof skillCategories].map(skill => (
                <Button
                  key={skill}
                  variant="outline"
                  size="sm"
                  className="text-xs justify-start h-8"
                  onClick={() => addSkill(skill)}
                  disabled={filters.skills.includes(skill)}
                >
                  {skill}
                </Button>
              ))}
            </div>
          )}
          
          {filters.skills.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Selected Skills:</Label>
              <div className="flex flex-wrap gap-1">
                {filters.skills.map(skill => (
                  <Badge key={skill} variant="default" className="text-xs">
                    {skill}
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:bg-destructive/20 rounded-full"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <DollarSign size={16} />
            {filterType === 'freelancers' ? 'Hourly Rate' : 'Project Budget'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{filters.budget[0].toLocaleString()}</span>
            <span>₹{filters.budget[1].toLocaleString()}+</span>
          </div>
          <Slider
            value={filters.budget}
            onValueChange={(value) => updateFilters({ budget: value })}
            max={200000}
            min={0}
            step={5000}
            className="w-full"
          />
        </CardContent>
      </Card>

      {/* Rating Filter */}
      {filterType === 'freelancers' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star size={16} />
              Minimum Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={filters.rating.toString()} 
              onValueChange={(value) => updateFilters({ rating: parseFloat(value) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any rating</SelectItem>
                <SelectItem value="4.5">4.5+ stars</SelectItem>
                <SelectItem value="4.0">4.0+ stars</SelectItem>
                <SelectItem value="3.5">3.5+ stars</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Experience Level */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clock size={16} />
            Experience Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filters.experience} onValueChange={(value) => updateFilters({ experience: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Any experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any experience</SelectItem>
              <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
              <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
              <SelectItem value="expert">Expert (5+ years)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Languages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Languages</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {['Hindi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati'].map(language => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox 
                id={language}
                checked={filters.languages.includes(language)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    updateFilters({ languages: [...filters.languages, language] });
                  } else {
                    updateFilters({ languages: filters.languages.filter(l => l !== language) });
                  }
                }}
              />
              <Label htmlFor={language} className="text-sm">{language}</Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reset and Apply */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={resetFilters}>
          Reset All
        </Button>
        <Button className="flex-1">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
