import React, { useState, useEffect } from 'react';
import { ProjectCard } from '@/components/shared/ProjectCard';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserMode } from '@/context/UserModeContext';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const projects = [
  // Indian market focused projects
  {
    id: '1',
    title: 'E-commerce Website for Indian Fashion Brand',
    description: 'Looking for an experienced UI/UX designer to create a mobile-first e-commerce platform for our ethnic wear brand targeting tier-2 cities.',
    budget: { min: 25000, max: 60000 },
    duration: '3-6 weeks',
    location: 'Remote',
    tags: ['UI/UX Design', 'E-commerce', 'Mobile-first'],
    proposals: 12,
    postedTime: '2 days ago',
    clientInfo: {
      name: 'Ethnic Styles Pvt Ltd',
      avatar: 'https://images.unsplash.com/photo-1549924231-f129b911e442',
      verified: true
    },
    featured: true
  },
  {
    id: '2',
    title: 'Food Delivery App - Android Development',
    description: 'Need a skilled Android developer to build a local food delivery app for our restaurant chain across Mumbai with real-time tracking.',
    budget: { min: 80000, max: 150000 },
    duration: '2-3 months',
    location: 'Mumbai or Remote',
    tags: ['Android Development', 'Food Tech', 'GPS'],
    proposals: 8,
    postedTime: '3 days ago',
    clientInfo: {
      name: 'Spice Route Restaurants',
      avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
      verified: true
    },
    featured: false
  },
  {
    id: '3',
    title: 'Hindi Content Writing for EdTech Platform',
    description: 'Seeking a bilingual content writer to create educational content in Hindi and English for our online learning platform.',
    budget: { min: 15000, max: 25000 },
    duration: 'Ongoing',
    location: 'Remote',
    tags: ['Hindi Content', 'Education', 'SEO'],
    proposals: 15,
    postedTime: '1 day ago',
    clientInfo: {
      name: 'LearnIndia EdTech',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
      verified: false
    },
    featured: false
  },
  {
    id: '4',
    title: 'Brand Identity Design for Startup',
    description: 'Startup in the renewable energy sector looking for a complete brand identity package including logo, color palette, typography and basic guidelines.',
    budget: { min: 1500, max: 3000 },
    duration: '3-4 weeks',
    location: 'Remote',
    tags: ['Branding', 'Logo Design', 'Identity Design'],
    proposals: 18,
    postedTime: '4 days ago',
    clientInfo: {
      name: 'GreenPower',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
      verified: true
    },
    featured: true
  },
  {
    id: '5',
    title: 'WordPress Website Development',
    description: 'Need a WordPress expert to build a website for a real estate agency with custom property listings, agent profiles, and search functionality.',
    budget: { min: 1200, max: 2500 },
    duration: '3-5 weeks',
    location: 'Remote',
    tags: ['WordPress', 'PHP', 'Web Development'],
    proposals: 22,
    postedTime: '2 days ago',
    clientInfo: {
      name: 'HomeQuest Realty',
      avatar: 'https://images.unsplash.com/photo-1552581234-26160f608093',
      verified: true
    },
    featured: false
  },
  {
    id: '6',
    title: 'Social Media Marketing Strategy',
    description: 'Looking for a social media strategist to develop a comprehensive marketing plan for our new line of sustainable beauty products.',
    budget: { min: 800, max: 1500 },
    duration: '1-2 weeks',
    location: 'Remote',
    tags: ['Social Media', 'Marketing Strategy', 'Beauty Industry'],
    proposals: 10,
    postedTime: '5 days ago',
    clientInfo: {
      name: 'EcoBeauty',
      avatar: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df',
      verified: false
    },
    featured: false
  },
  {
    id: '7',
    title: 'Video Editing for YouTube Channel',
    description: 'Need a video editor for our cooking channel. Must be proficient in After Effects, Premiere Pro, and have experience with food-related content.',
    budget: { min: 300, max: 600 },
    duration: 'Ongoing',
    location: 'Remote',
    tags: ['Video Editing', 'YouTube', 'After Effects'],
    proposals: 14,
    postedTime: '1 day ago',
    clientInfo: {
      name: 'Gourmet Bites',
      avatar: 'https://images.unsplash.com/photo-1506354666786-959d6d497f1a',
      verified: true
    },
    featured: false
  },
  {
    id: '8',
    title: 'Custom CRM Software Development',
    description: 'Seeking a developer to create a custom CRM system for a consulting firm with specific workflow and reporting requirements.',
    budget: { min: 8000, max: 15000 },
    duration: '3-5 months',
    location: 'Remote',
    tags: ['CRM', 'Software Development', 'Database'],
    proposals: 6,
    postedTime: '7 days ago',
    clientInfo: {
      name: 'ConsultPro Solutions',
      avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
      verified: true
    },
    featured: true
  }
];

const categories = [
  'All Categories',
  'Web Development',
  'Mobile Development', 
  'Design & Creative',
  'Content & Writing',
  'Digital Marketing',
  'Video & Animation',
  'Data & Analytics',
  'Business Services',
  'Photography'
];

const Projects = () => {
  const { mode } = useUserMode();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(200000);
  
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
      for (const category of categories) {
        if (category === 'All Categories') continue;
        
        const matchesCategory = projects.some(project => 
          project.tags.some(tag => {
            if (category === 'Web Development') return ['Web Development', 'WordPress', 'PHP'].some(tech => tag.includes(tech));
            if (category === 'Mobile Development') return ['Mobile Development', 'iOS', 'Android'].some(tech => tag.includes(tech));
            if (category === 'Design') return ['UI/UX Design', 'Branding', 'Logo Design', 'Identity Design'].some(design => tag.includes(design));
            if (category === 'Writing') return ['Content Writing', 'Copywriting'].some(writing => tag.includes(writing));
            if (category === 'Marketing') return ['Marketing Strategy', 'Social Media', 'SEO'].some(marketing => tag.includes(marketing));
            if (category === 'Video & Animation') return ['Video Editing', 'After Effects'].some(video => tag.includes(video));
            return false;
          })
        );
        
        if (matchesCategory) {
          setSelectedCategory(category);
          break;
        }
      }
    }
  }, [searchParams]);
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = 
      !selectedTag || 
      project.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      project.tags.some(tag => {
        if (selectedCategory === 'Web Development') return ['Web Development', 'WordPress', 'PHP'].some(tech => tag.includes(tech));
        if (selectedCategory === 'Mobile Development') return ['Mobile Development', 'iOS', 'Android'].some(tech => tag.includes(tech));
        if (selectedCategory === 'Design') return ['UI/UX Design', 'Branding', 'Logo Design', 'Identity Design'].some(design => tag.includes(design));
        if (selectedCategory === 'Writing') return ['Content Writing', 'Copywriting'].some(writing => tag.includes(writing));
        if (selectedCategory === 'Marketing') return ['Marketing Strategy', 'Social Media', 'SEO'].some(marketing => tag.includes(marketing));
        if (selectedCategory === 'Video & Animation') return ['Video Editing', 'After Effects'].some(video => tag.includes(video));
        return false;
      });
    
    const matchesBudget = 
      project.budget.min <= maxBudget && project.budget.max >= minBudget;
    
    return matchesSearch && matchesCategory && matchesBudget && matchesTag;
  });
  
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setSearchParams({ tag });
  };
  
  const handlePostProject = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.isLoggedIn) {
      navigate('/post-project');
    } else {
      navigate('/login');
    }
  };
  
  const renderProjectCard = (project) => (
    <ProjectCard 
      key={project.id} 
      {...project} 
      onTagClick={handleTagClick}
    />
  );
  
  return (
    <div className="pt-24 pb-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              {selectedTag ? `Jobs tagged with "${selectedTag}"` : 'Browse Jobs'}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {mode === 'freelancer' 
                ? 'Discover exciting opportunities from Indian businesses and start earning with your skills.' 
                : 'Post your project and connect with India\'s best verified freelancers.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            {mode === 'client' && (
              <Button 
                className="rounded-full gap-2 shrink-0 whitespace-nowrap"
                onClick={handlePostProject}
              >
                <Plus size={18} />
                Post a Project
              </Button>
            )}
            
            <div className={cn(
              "relative flex items-center w-full",
              "subtle-shadow rounded-full bg-card border border-border transition-all duration-300 overflow-hidden",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
            )}>
              <Search size={18} className="ml-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="flex-1 px-3 py-2 bg-transparent border-0 outline-none focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full mr-1 h-7 w-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full subtle-shadow shrink-0"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersHorizontal size={18} />
            </Button>
          </div>
        </div>
        
        {selectedTag && (
          <div className="mb-6">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => {
                setSelectedTag(null);
                setSearchParams({});
              }}
            >
              {selectedTag}
              <X size={14} />
            </Button>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={cn(
            "lg:w-1/4 card-elevated p-6 rounded-xl border subtle-shadow",
            "transition-all duration-300 overflow-hidden lg:max-h-none",
            isFilterOpen ? "max-h-[1000px]" : "max-h-0 lg:max-h-none p-0 lg:p-6"
          )}>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={cn(
                        "block text-sm py-1.5 px-3 rounded-lg w-full text-left transition-colors",
                        selectedCategory === category 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Budget Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">₹{minBudget.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">₹{maxBudget.toLocaleString()}+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Project Type</h3>
                <div className="space-y-2">
                  {['All Types', 'One-time Project', 'Ongoing Project'].map(type => (
                    <button
                      key={type}
                      className={cn(
                        "block text-sm py-1.5 px-3 rounded-lg w-full text-left transition-colors",
                        "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                    setSelectedTag(null);
                    setMinBudget(0);
                    setMaxBudget(200000);
                    setSearchParams({});
                  }}
                >
                  Reset
                </Button>
                <Button className="flex-1">Apply Filters</Button>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredProjects.length} opportunities
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded-lg px-3 py-1.5 bg-card">
                  <option>Newest First</option>
                  <option>Budget: High to Low</option>
                  <option>Budget: Low to High</option>
                  <option>Most Proposals</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.length > 0 ? (
                filteredProjects.map(project => renderProjectCard(project))
              ) : (
                <div className="text-center py-12 bg-secondary/30 rounded-xl lg:col-span-2">
                  <h3 className="text-xl font-medium mb-2">No opportunities found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search filters or browse different categories to find jobs that match your skills.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Categories');
                      setSelectedTag(null);
                      setMinBudget(0);
                      setMaxBudget(20000);
                      setSearchParams({});
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
            
            {filteredProjects.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
