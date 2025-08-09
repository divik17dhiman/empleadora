
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { Bookmark, MessageSquare, Star, MapPin, UserCheck, Shield, Award, Clock, Briefcase, FileText, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useSavedProfiles } from '@/context/SavedProfilesContext';

const freelancerProfile = {
  id: '1',
  name: 'Jessica Chen',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  title: 'UI/UX Designer & Brand Strategist',
  rating: 4.9,
  reviewCount: 156,
  location: 'San Francisco, USA',
  hourlyRate: 85,
  tags: ['UI/UX Design', 'Branding', 'Wireframing', 'User Research', 'Mobile App Design', 'Design Systems'],
  bio: "I'm a passionate UI/UX designer with over 8 years of experience creating beautiful, functional digital products. I specialize in user-centered design practices that help businesses connect with their customers through intuitive interfaces.",
  memberSince: 'January 2020',
  lastActive: '2 hours ago',
  completedProjects: 78,
  ongoingProjects: 3,
  languages: [
    { name: 'English', level: 'Native' },
    { name: 'Mandarin', level: 'Fluent' },
    { name: 'Spanish', level: 'Conversational' }
  ],
  education: [
    { degree: 'M.A. in Interaction Design', school: 'California College of the Arts', year: '2015-2017' },
    { degree: 'B.A. in Graphic Design', school: 'University of California, Los Angeles', year: '2011-2015' }
  ],
  portfolio: [
    { id: 1, title: 'E-commerce App Redesign', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', category: 'Mobile App' },
    { id: 2, title: 'Financial Dashboard', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', category: 'Web App' },
    { id: 3, title: 'Travel Booking Platform', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', category: 'UI/UX Design' },
    { id: 4, title: 'Healthcare Provider Website', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', category: 'Website' },
  ],
  verifications: ['Identity', 'Payment Method', 'Email', 'Phone'],
  successRate: 98,
  onTimeDelivery: 100,
  reviews: [
    { id: 1, client: 'Michael T.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', rating: 5, date: 'June 15, 2023', text: 'Jessica did an outstanding job redesigning our e-commerce app. She took the time to understand our brand and customers, and delivered a design that exceeded our expectations. Highly recommend!', project: 'E-commerce App Redesign' },
    { id: 2, client: 'Sarah W.', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e', rating: 5, date: 'May 22, 2023', text: "Working with Jessica was a pleasure. She's professional, communicative, and extremely talented. The financial dashboard she designed has received great feedback from our users.", project: 'Financial Dashboard Design' },
    { id: 3, client: 'David P.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d', rating: 4, date: 'April 10, 2023', text: 'Jessica delivered high-quality work within the timeline. She was open to feedback and made revisions quickly. Would definitely work with her again.', project: 'Healthcare Provider Website' }
  ]
};

const completedProjects = [
  {
    id: '1',
    title: 'E-commerce Website Redesign',
    description: 'Redesigned the UI/UX for an e-commerce platform with a focus on improving conversion rates and user experience.',
    budget: { min: 2000, max: 5000 },
    duration: '3 weeks',
    location: 'Remote',
    tags: ['UI/UX Design', 'E-commerce', 'Figma'],
    proposals: 12,
    postedTime: 'Completed May 2023',
    clientInfo: {
      name: 'TechSolutions Inc.',
      avatar: 'https://images.unsplash.com/photo-1549924231-f129b911e442',
      verified: true
    },
    featured: false
  },
  {
    id: '2',
    title: 'Mobile App Design for Fitness Tracking',
    description: 'Created a complete design system and UI for a fitness tracking mobile application focusing on user engagement and activity visualization.',
    budget: { min: 1500, max: 3000 },
    duration: '4 weeks',
    location: 'Remote',
    tags: ['Mobile Design', 'UI/UX', 'Fitness'],
    proposals: 8,
    postedTime: 'Completed March 2023',
    clientInfo: {
      name: 'FitTrack',
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      verified: true
    },
    featured: false
  }
];

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { saveProfile, removeProfile, isSaved } = useSavedProfiles();
  const [isProfileSaved, setIsProfileSaved] = useState(() => isSaved(id || ''));
  
  const profile = freelancerProfile;
  
  const handleSaveProfile = () => {
    if (isProfileSaved) {
      removeProfile(profile.id);
      setIsProfileSaved(false);
      toast({
        title: 'Profile removed',
        description: `${profile.name} has been removed from your saved profiles.`
      });
    } else {
      saveProfile({
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        title: profile.title
      });
      setIsProfileSaved(true);
      toast({
        title: 'Profile saved',
        description: `${profile.name} has been added to your saved profiles.`
      });
    }
  };
  
  const handleContactClick = () => {
    navigate(`/contact?freelancer=${profile.id}&name=${encodeURIComponent(profile.name)}`);
  };
  
  // Add this function to handle tag clicks
  const handleTagClick = (tag: string) => {
    navigate(`/freelancers?tag=${encodeURIComponent(tag)}`);
    toast({
      title: 'Filtering by tag',
      description: `Showing freelancers with "${tag}" skills`
    });
  };
  
  return (
    <div className="pt-24 pb-20">
      <div className="container px-4 mx-auto">
        <div className="card-elevated rounded-xl border overflow-hidden subtle-shadow mb-8">
          <div className="bg-primary/5 h-40 relative">
            <div className="absolute bottom-0 left-0 w-full flex justify-center">
              <div className="absolute -bottom-16 card-elevated rounded-full p-1.5 border">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-32 h-32 rounded-full object-cover" 
                />
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-6 text-center">
            <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
            <p className="text-muted-foreground mb-3">{profile.title}</p>
            
            <div className="flex items-center justify-center gap-4 mb-5">
              <div className="flex items-center">
                <Star size={18} className="text-amber-500 mr-1" />
                <span className="font-medium">{profile.rating.toFixed(1)}</span>
                <span className="text-muted-foreground ml-1">({profile.reviewCount})</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin size={16} className="mr-1" />
                {profile.location}
              </div>
              <div className="font-medium">
                ${profile.hourlyRate}/hr
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {profile.tags.slice(0, 5).map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="rounded-full px-3 py-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
              {profile.tags.length > 5 && (
                <Badge 
                  variant="outline" 
                  className="rounded-full px-3 py-1 cursor-pointer hover:bg-secondary/20 transition-colors"
                  onClick={() => setActiveTab('overview')}
                >
                  +{profile.tags.length - 5} more
                </Badge>
              )}
            </div>
            
            <div className="flex justify-center gap-3">
              <Button className="rounded-full px-6 gap-2" onClick={handleContactClick}>
                <MessageSquare size={16} />
                Contact
              </Button>
              <Button 
                variant="outline" 
                className={cn(
                  "rounded-full px-6 gap-2",
                  isProfileSaved && "text-primary border-primary"
                )}
                onClick={handleSaveProfile}
              >
                <Bookmark size={16} fill={isProfileSaved ? "currentColor" : "none"} />
                {isProfileSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
          <div className="card-elevated rounded-lg border p-1 subtle-shadow">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="history">Work History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 card-elevated rounded-xl border p-6 subtle-shadow">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-line mb-6">
                  {profile.bio}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Languages</h3>
                    <ul className="space-y-2">
                      {profile.languages.map((language, index) => (
                        <li key={index} className="flex justify-between text-sm">
                          <span>{language.name}</span>
                          <span className="text-muted-foreground">{language.level}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Education</h3>
                    <ul className="space-y-3">
                      {profile.education.map((edu, index) => (
                        <li key={index} className="text-sm">
                          <div className="font-medium">{edu.degree}</div>
                          <div className="text-muted-foreground">{edu.school}</div>
                          <div className="text-xs text-muted-foreground">{edu.year}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="card-elevated rounded-xl border p-6 subtle-shadow">
                  <h3 className="font-medium border-b pb-3 mb-4">Profile Stats</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <UserCheck size={18} className="text-primary mr-3" />
                        <span>Member Since</span>
                      </div>
                      <span className="font-medium">{profile.memberSince}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock size={18} className="text-primary mr-3" />
                        <span>Last Active</span>
                      </div>
                      <span className="font-medium">{profile.lastActive}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText size={18} className="text-primary mr-3" />
                        <span>Completed Projects</span>
                      </div>
                      <span className="font-medium">{profile.completedProjects}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Briefcase size={18} className="text-primary mr-3" />
                        <span>Ongoing Projects</span>
                      </div>
                      <span className="font-medium">{profile.ongoingProjects}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-elevated rounded-xl border p-6 subtle-shadow">
                  <h3 className="font-medium border-b pb-3 mb-4">Verifications</h3>
                  
                  <div className="space-y-3">
                    {profile.verifications.map((verification, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <Shield size={16} className="text-green-500 mr-2" />
                        {verification} Verified
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="card-elevated rounded-xl border p-6 subtle-shadow">
                  <h3 className="font-medium border-b pb-3 mb-4">Success Metrics</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Success Rate</span>
                        <span className="font-medium">{profile.successRate}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${profile.successRate}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>On-Time Delivery</span>
                        <span className="font-medium">{profile.onTimeDelivery}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${profile.onTimeDelivery}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-elevated rounded-xl border p-6 subtle-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Featured Work</h2>
                <Button 
                  variant="ghost" 
                  className="text-primary"
                  onClick={() => setActiveTab('portfolio')}
                >
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {profile.portfolio.slice(0, 4).map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative overflow-hidden rounded-lg aspect-square"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-elevated rounded-xl border p-6 subtle-shadow">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Reviews</h2>
                <Button 
                  variant="ghost" 
                  className="text-primary"
                  onClick={() => setActiveTab('reviews')}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-6">
                {profile.reviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={review.avatar} 
                          alt={review.client} 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                        <div>
                          <div className="font-medium">{review.client}</div>
                          <div className="text-sm text-muted-foreground">{review.project}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? "text-amber-500" : "text-gray-200"} 
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-8">
            <div className="card-elevated rounded-xl border p-6 subtle-shadow">
              <h2 className="text-xl font-semibold mb-6">Portfolio</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {profile.portfolio.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative overflow-hidden rounded-lg aspect-square"
                  >
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium">{item.title}</h3>
                      <p className="text-white/80 text-sm">{item.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-8">
            <div className="card-elevated rounded-xl border p-6 subtle-shadow">
              <h2 className="text-xl font-semibold mb-6">Client Reviews</h2>
              
              <div className="space-y-6">
                {profile.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={review.avatar} 
                          alt={review.client} 
                          className="w-10 h-10 rounded-full object-cover" 
                        />
                        <div>
                          <div className="font-medium">{review.client}</div>
                          <div className="text-sm text-muted-foreground">{review.project}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < review.rating ? "text-amber-500" : "text-gray-200"} 
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">{review.date}</div>
                      </div>
                    </div>
                    <p className="mt-3 text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-8">
            <div className="card-elevated rounded-xl border p-6 subtle-shadow">
              <h2 className="text-xl font-semibold mb-6">Completed Projects</h2>
              
              <div className="space-y-6">
                {completedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
