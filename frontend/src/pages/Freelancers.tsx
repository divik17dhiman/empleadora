
import React, { useState } from 'react';
import { ProfileCard } from '@/components/shared/ProfileCard';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X, MapPin, Star, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

// Enhanced sample data for Indian market
const freelancers = [
  // Indian freelancers with enhanced data
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    title: 'UI/UX Designer & Mobile App Specialist',
    rating: 4.9,
    reviewCount: 156,
    location: 'Bangalore, Karnataka',
    hourlyRate: 1200,
    tags: ['UI/UX Design', 'Mobile Apps', 'Figma', 'Adobe XD'],
    featured: true,
    description: 'Passionate UI/UX designer with 5+ years of experience creating intuitive and beautiful user experiences. Specialized in mobile app design and user research.',
    portfolio: 'https://priyasharma.design',
    email: 'priya.sharma@email.com',
    phone: '+91 98765 43210',
    experience: '5+ years',
    languages: ['English', 'Hindi', 'Kannada'],
    availability: 'Available for new projects',
    completedProjects: 89,
    responseTime: '2 hours'
  },
  {
    id: '2',
    name: 'Arjun Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    title: 'Full Stack Developer',
    rating: 4.8,
    reviewCount: 142,
    location: 'Pune, Maharashtra',
    hourlyRate: 1500,
    tags: ['React', 'Node.js', 'Python', 'MongoDB', 'AWS'],
    featured: false,
    description: 'Experienced full-stack developer specializing in modern web technologies. Expert in building scalable applications and microservices architecture.',
    portfolio: 'https://arjunpatel.dev',
    email: 'arjun.patel@email.com',
    phone: '+91 87654 32109',
    experience: '7+ years',
    languages: ['English', 'Hindi', 'Marathi'],
    availability: 'Available for new projects',
    completedProjects: 67,
    responseTime: '1 hour'
  },
  {
    id: '3',
    name: 'Kavya Reddy',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e',
    title: 'Content Writer & Digital Marketing Expert',
    rating: 4.7,
    reviewCount: 98,
    location: 'Hyderabad, Telangana',
    hourlyRate: 800,
    tags: ['Content Writing', 'SEO', 'Social Media', 'Email Marketing'],
    featured: false,
    description: 'Creative content writer and digital marketing specialist. Expert in SEO-optimized content, social media strategies, and brand storytelling.',
    portfolio: 'https://kavyareddy.com',
    email: 'kavya.reddy@email.com',
    phone: '+91 76543 21098',
    experience: '4+ years',
    languages: ['English', 'Hindi', 'Telugu'],
    availability: 'Available for new projects',
    completedProjects: 124,
    responseTime: '3 hours'
  },
  {
    id: '4',
    name: 'Rohit Singh',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    title: 'Mobile App Developer & Flutter Expert',
    rating: 4.6,
    reviewCount: 89,
    location: 'Gurgaon, Haryana',
    hourlyRate: 1300,
    tags: ['iOS', 'Android', 'Flutter', 'React Native', 'Firebase'],
    featured: false,
    description: 'Mobile app development expert with focus on cross-platform solutions. Specialized in Flutter and React Native for iOS and Android.',
    portfolio: 'https://rohitsingh.dev',
    email: 'rohit.singh@email.com',
    phone: '+91 65432 10987',
    experience: '6+ years',
    languages: ['English', 'Hindi', 'Punjabi'],
    availability: 'Available for new projects',
    completedProjects: 45,
    responseTime: '4 hours'
  },
  {
    id: '5',
    name: 'Anjali Desai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    title: 'Graphic Designer & Illustrator',
    rating: 4.9,
    reviewCount: 127,
    location: 'Mumbai, Maharashtra',
    hourlyRate: 1000,
    tags: ['Illustration', 'Logo Design', 'Branding', 'Adobe Creative Suite'],
    featured: true,
    description: 'Creative graphic designer and illustrator with a passion for creating memorable brand identities and stunning visual designs.',
    portfolio: 'https://anjalidesai.art',
    email: 'anjali.desai@email.com',
    phone: '+91 54321 09876',
    experience: '8+ years',
    languages: ['English', 'Hindi', 'Marathi', 'Gujarati'],
    availability: 'Available for new projects',
    completedProjects: 156,
    responseTime: '2 hours'
  },
  {
    id: '6',
    name: 'Vikram Malhotra',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
    title: 'WordPress Developer & E-commerce Specialist',
    rating: 4.5,
    reviewCount: 74,
    location: 'Delhi, NCR',
    hourlyRate: 900,
    tags: ['WordPress', 'PHP', 'E-commerce', 'WooCommerce', 'Shopify'],
    featured: false,
    description: 'WordPress expert specializing in custom themes, plugins, and e-commerce solutions. Experienced in WooCommerce and Shopify development.',
    portfolio: 'https://vikrammalhotra.com',
    email: 'vikram.malhotra@email.com',
    phone: '+91 43210 98765',
    experience: '5+ years',
    languages: ['English', 'Hindi', 'Punjabi'],
    availability: 'Available for new projects',
    completedProjects: 92,
    responseTime: '3 hours'
  },
  {
    id: '7',
    name: 'Meera Iyer',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
    title: 'Digital Marketing Specialist',
    rating: 4.7,
    reviewCount: 112,
    location: 'Chennai, Tamil Nadu',
    hourlyRate: 950,
    tags: ['Social Media', 'SEO', 'Content Marketing', 'Google Ads', 'Analytics'],
    featured: false,
    description: 'Digital marketing specialist with expertise in social media management, SEO, and paid advertising campaigns. Data-driven approach to marketing.',
    portfolio: 'https://meeraiyer.com',
    email: 'meera.iyer@email.com',
    phone: '+91 32109 87654',
    experience: '6+ years',
    languages: ['English', 'Hindi', 'Tamil'],
    availability: 'Available for new projects',
    completedProjects: 78,
    responseTime: '2 hours'
  },
  {
    id: '8',
    name: 'Rajesh Kumar',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    title: 'Backend Developer & DevOps Engineer',
    rating: 4.8,
    reviewCount: 95,
    location: 'Mumbai, Maharashtra',
    hourlyRate: 1400,
    tags: ['Java', 'Spring Boot', 'Microservices', 'Docker', 'Kubernetes'],
    featured: false,
    description: 'Senior backend developer and DevOps engineer with expertise in Java, microservices architecture, and cloud infrastructure.',
    portfolio: 'https://rajeshkumar.dev',
    email: 'rajesh.kumar@email.com',
    phone: '+91 21098 76543',
    experience: '9+ years',
    languages: ['English', 'Hindi', 'Marathi'],
    availability: 'Available for new projects',
    completedProjects: 67,
    responseTime: '1 hour'
  },
  {
    id: '9',
    name: 'Sneha Gupta',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    title: 'Project Manager & Agile Coach',
    rating: 4.9,
    reviewCount: 131,
    location: 'Bangalore, Karnataka',
    hourlyRate: 1100,
    tags: ['Agile', 'Scrum', 'Team Leadership', 'JIRA', 'Confluence'],
    featured: true,
    description: 'Certified Scrum Master and project manager with experience leading cross-functional teams and delivering complex projects on time.',
    portfolio: 'https://snehagupta.com',
    email: 'sneha.gupta@email.com',
    phone: '+91 10987 65432',
    experience: '7+ years',
    languages: ['English', 'Hindi', 'Kannada'],
    availability: 'Available for new projects',
    completedProjects: 89,
    responseTime: '2 hours'
  },
  {
    id: '10',
    name: 'Amit Shah',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    title: 'Data Scientist & Machine Learning Engineer',
    rating: 4.6,
    reviewCount: 67,
    location: 'Pune, Maharashtra',
    hourlyRate: 1600,
    tags: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch'],
    featured: false,
    description: 'Data scientist and ML engineer specializing in predictive analytics, computer vision, and natural language processing.',
    portfolio: 'https://amitshah.ai',
    email: 'amit.shah@email.com',
    phone: '+91 09876 54321',
    experience: '5+ years',
    languages: ['English', 'Hindi', 'Marathi'],
    availability: 'Available for new projects',
    completedProjects: 34,
    responseTime: '4 hours'
  },
  {
    id: '11',
    name: 'Pooja Verma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    title: 'Video Editor & Motion Graphics Designer',
    rating: 4.8,
    reviewCount: 89,
    location: 'Mumbai, Maharashtra',
    hourlyRate: 1200,
    tags: ['Video Editing', 'Motion Graphics', 'After Effects', 'Premiere Pro', 'Cinema 4D'],
    featured: false,
    description: 'Creative video editor and motion graphics designer with expertise in creating engaging visual content for brands and businesses.',
    portfolio: 'https://poojaverma.com',
    email: 'pooja.verma@email.com',
    phone: '+91 98765 43210',
    experience: '4+ years',
    languages: ['English', 'Hindi', 'Marathi'],
    availability: 'Available for new projects',
    completedProjects: 67,
    responseTime: '3 hours'
  },
  {
    id: '12',
    name: 'Suresh Menon',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    title: 'Cybersecurity Expert & Penetration Tester',
    rating: 4.7,
    reviewCount: 45,
    location: 'Bangalore, Karnataka',
    hourlyRate: 1800,
    tags: ['Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Network Security', 'OWASP'],
    featured: false,
    description: 'Certified cybersecurity expert and penetration tester with experience in securing web applications and network infrastructure.',
    portfolio: 'https://sureshmenon.security',
    email: 'suresh.menon@email.com',
    phone: '+91 87654 32109',
    experience: '8+ years',
    languages: ['English', 'Hindi', 'Kannada', 'Malayalam'],
    availability: 'Available for new projects',
    completedProjects: 23,
    responseTime: '6 hours'
  }
];

const categories = [
  'All Categories',
  'Development',
  'Design',
  'Marketing',
  'Writing',
  'Admin Support',
  'Customer Service',
  'Sales',
  'Engineering',
  'Data Science'
];

const Freelancers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minRate, setMinRate] = useState(0);
  const [maxRate, setMaxRate] = useState(2000);
  const [minRating, setMinRating] = useState(0);
  
  const filteredFreelancers = freelancers.filter(freelancer => {
    const matchesSearch = 
      searchQuery === '' || 
      freelancer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All Categories' || 
      freelancer.tags.some(tag => {
        if (selectedCategory === 'Development') return ['React', 'Node.js', 'MongoDB', 'iOS', 'Android', 'WordPress', 'PHP', 'Java'].some(tech => tag.includes(tech));
        if (selectedCategory === 'Design') return ['UI/UX Design', 'Branding', 'Illustration', 'Logo Design'].some(design => tag.includes(design));
        if (selectedCategory === 'Marketing') return ['SEO', 'Social Media', 'Content Marketing'].some(marketing => tag.includes(marketing));
        if (selectedCategory === 'Writing') return ['Content Strategy', 'Copywriting'].some(writing => tag.includes(writing));
        return false;
      });
    
    const matchesRate = freelancer.hourlyRate >= minRate && freelancer.hourlyRate <= maxRate;
    const matchesRating = freelancer.rating >= minRating;
    
    return matchesSearch && matchesCategory && matchesRate && matchesRating;
  });

  // Debug logging
  console.log('Total freelancers:', freelancers.length);
  console.log('Filtered freelancers:', filteredFreelancers.length);
  console.log('Current filters:', { searchQuery, selectedCategory, minRate, maxRate, minRating });
  
  return (
    <div className="pt-24 pb-20">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Discover Indian Talent</h1>
            <p className="text-muted-foreground max-w-2xl">
              Connect with India's most skilled and verified freelancers across technology, design, content, and more. Find the perfect professional for your next project.
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className={cn(
              "relative flex items-center w-full",
              "subtle-shadow rounded-full bg-card border border-border transition-all duration-300 overflow-hidden",
              "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
            )}>
              <Search size={18} className="ml-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search freelancers or skills..."
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
                <h3 className="font-medium mb-4">Hourly Rate (₹)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">₹{minRate}</span>
                    <span className="text-sm text-muted-foreground">₹{maxRate}+</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={maxRate}
                    onChange={(e) => setMaxRate(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Minimum Rating</h3>
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5].map(rating => (
                    <button
                      key={rating}
                      className={cn(
                        "flex-1 text-sm py-1.5 px-2 rounded-lg text-center transition-colors",
                        minRating === rating
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                      onClick={() => setMinRating(rating)}
                    >
                      {rating > 0 ? `${rating}+` : 'Any'}
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
                      setMinRate(0);
                      setMaxRate(2000);
                      setMinRating(0);
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
                Showing {filteredFreelancers.length} freelancers
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select className="text-sm border rounded-lg px-3 py-1.5 bg-card">
                  <option>Relevance</option>
                  <option>Rating: High to Low</option>
                  <option>Hourly Rate: Low to High</option>
                  <option>Hourly Rate: High to Low</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {filteredFreelancers.length > 0 ? (
                filteredFreelancers.map(freelancer => (
                  <ProfileCard
                    key={freelancer.id}
                    {...freelancer}
                  />
                ))
              ) : (
                <div className="text-center py-12 bg-secondary/30 rounded-xl">
                  <h3 className="text-xl font-medium mb-2">No freelancers found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search filters or try a different search term.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Categories');
                      setMinRate(0);
                      setMaxRate(2000);
                      setMinRating(0);
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
            
            {filteredFreelancers.length > 0 && (
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

export default Freelancers;
