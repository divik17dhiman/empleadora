
import React, { useState } from 'react';
import { ContestCard } from '@/components/shared/ContestCard';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserMode } from '@/context/UserModeContext';
import { Link } from 'react-router-dom';

// Sample data for demonstration
const contests = [
  // Original contests
  {
    id: '1',
    title: 'Logo Design for Sustainable Fashion Brand',
    description: 'Create a modern, minimalist logo for our sustainable fashion brand that embodies eco-friendly values and premium quality.',
    prize: 1000,
    deadline: 'Jul 15, 2023',
    timeLeft: '5 days left',
    entries: 24,
    category: 'Logo Design',
    featured: true
  },
  {
    id: '2',
    title: 'Mobile App UI Design',
    description: 'Design a clean, intuitive user interface for a wellness and meditation mobile application targeting young professionals.',
    prize: 800,
    deadline: 'Jul 10, 2023',
    timeLeft: '8 hours left',
    entries: 15,
    category: 'UI Design',
    featured: false
  },
  {
    id: '3',
    title: 'Product Name and Tagline',
    description: 'Help us name our new smart home device and create a catchy tagline that highlights its innovative features and benefits.',
    prize: 500,
    deadline: 'Jul 20, 2023',
    timeLeft: '10 days left',
    entries: 42,
    category: 'Naming & Taglines',
    featured: false
  },
  // Additional contests
  {
    id: '4',
    title: 'Website Design for Boutique Hotel',
    description: 'Design a luxurious, elegant website for a boutique hotel located in Santorini. Must capture the essence of Greek island luxury.',
    prize: 1200,
    deadline: 'Jul 25, 2023',
    timeLeft: '15 days left',
    entries: 8,
    category: 'Web Design',
    featured: true
  },
  {
    id: '5',
    title: 'T-shirt Design for Tech Conference',
    description: 'Create a trendy, modern t-shirt design for our annual developer conference. Should represent the theme "Code the Future".',
    prize: 350,
    deadline: 'Jul 12, 2023',
    timeLeft: '3 days left',
    entries: 27,
    category: 'Apparel Design',
    featured: false
  },
  {
    id: '6',
    title: 'Character Design for Mobile Game',
    description: 'Design the main hero character for our fantasy adventure mobile game. Character should appeal to young adults and have a unique style.',
    prize: 750,
    deadline: 'Jul 18, 2023',
    timeLeft: '8 days left',
    entries: 19,
    category: 'Character Design',
    featured: false
  },
  {
    id: '7',
    title: 'Podcast Cover Art',
    description: 'Create eye-catching cover art for a podcast about sustainable living and eco-friendly practices. Must look good in small thumbnail format.',
    prize: 300,
    deadline: 'Jul 8, 2023',
    timeLeft: '6 hours left',
    entries: 31,
    category: 'Cover Art',
    featured: false
  },
  {
    id: '8',
    title: 'Brand Identity for Artisanal Coffee Shop',
    description: 'Design a complete brand identity including logo, color scheme, and basic design elements for a new artisanal coffee shop in Brooklyn.',
    prize: 1500,
    deadline: 'Jul 30, 2023',
    timeLeft: '20 days left',
    entries: 12,
    category: 'Brand Identity',
    featured: true
  }
];

const categories = [
  'All Categories',
  'Logo Design',
  'Web Design',
  'Mobile Design',
  'Graphic Design',
  'Illustration',
  'Packaging',
  'Apparel Design',
  'Brand Identity',
  'Product Design',
  'Cover Art',
  'Character Design',
  'Naming & Taglines'
];

const Contests = () => {
  const { mode } = useUserMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrize, setMinPrize] = useState(0);
  const [maxPrize, setMaxPrize] = useState(2000);
  
  const filteredContests = contests.filter(contest => {
    const matchesSearch = 
      searchQuery === '' || 
      contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contest.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      contest.category === selectedCategory;
    
    const matchesPrize = contest.prize >= minPrize && contest.prize <= maxPrize;
    
    return matchesSearch && matchesCategory && matchesPrize;
  });
  
  return (
    <div className="pt-24 pb-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Design Contests</h1>
            <p className="text-muted-foreground max-w-2xl">
              {mode === 'freelancer' 
                ? 'Showcase your creativity and win prizes by participating in our design contests.' 
                : 'Post a contest to receive multiple creative submissions for your project.'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            {mode === 'client' && (
              <Button asChild className="rounded-full gap-2 shrink-0 whitespace-nowrap">
                <Link to="/contests/new">
                  <Plus size={18} />
                  Start a Contest
                </Link>
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
                placeholder="Search contests..."
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
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <div className={cn(
            "lg:w-1/4 card-elevated p-6 rounded-xl border subtle-shadow",
            "transition-all duration-300 overflow-hidden lg:max-h-none",
            isFilterOpen ? "max-h-[1000px]" : "max-h-0 lg:max-h-none p-0 lg:p-6"
          )}>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Categories</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
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
                <h3 className="font-medium mb-4">Prize Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">${minPrize}</span>
                    <span className="text-sm text-muted-foreground">${maxPrize}+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={maxPrize}
                    onChange={(e) => setMaxPrize(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Contest Status</h3>
                <div className="space-y-2">
                  {['All Status', 'Ending Soon', 'Just Started', 'Featured'].map(status => (
                    <button
                      key={status}
                      className={cn(
                        "block text-sm py-1.5 px-3 rounded-lg w-full text-left transition-colors",
                        "text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {status}
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
                    setMinPrize(0);
                    setMaxPrize(2000);
                  }}
                >
                  Reset
                </Button>
                <Button className="flex-1">Apply Filters</Button>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground">
                Showing {filteredContests.length} contests
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded-lg px-3 py-1.5 bg-card">
                  <option>Ending Soon</option>
                  <option>Prize: High to Low</option>
                  <option>Most Entries</option>
                  <option>Recently Added</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredContests.length > 0 ? (
                filteredContests.map(contest => (
                  <ContestCard
                    key={contest.id}
                    {...contest}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-secondary/30 rounded-xl lg:col-span-2">
                  <h3 className="text-xl font-medium mb-2">No contests found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search filters or try a different search term.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Categories');
                      setMinPrize(0);
                      setMaxPrize(2000);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
            
            {filteredContests.length > 0 && (
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

export default Contests;
