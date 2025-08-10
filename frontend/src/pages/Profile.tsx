
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  ExternalLink, 
  ArrowLeft, 
  Calendar,
  DollarSign,
  Users,
  Award,
  CheckCircle,
  MessageSquare,
  Bookmark,
  Share2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSavedProfiles } from '@/context/SavedProfilesContext';
import { ReviewCard } from '@/components/shared/ReviewCard';

// Enhanced freelancer data with reviews and portfolio
const freelancers = [
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
    responseTime: '2 hours',
    about: 'I am a passionate UI/UX designer with over 5 years of experience in creating user-centered digital experiences. I specialize in mobile app design, web interfaces, and user research. My approach combines creativity with data-driven insights to deliver solutions that not only look great but also provide exceptional user experiences.',
    education: [
      {
        degree: 'Bachelor of Design',
        institution: 'National Institute of Design, Ahmedabad',
        year: '2018'
      }
    ],
    certifications: [
      'Google UX Design Professional Certificate',
      'Figma Advanced Design Course',
      'Mobile App Design Specialization'
    ],
    portfolioItems: [
      {
        id: '1',
        title: 'E-commerce Mobile App',
        description: 'Complete redesign of a fashion e-commerce app with improved user flow and conversion optimization.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
        category: 'Mobile App Design'
      },
      {
        id: '2',
        title: 'Banking Dashboard',
        description: 'Modern banking interface design focusing on security and ease of use.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f',
        category: 'Web Design'
      },
      {
        id: '3',
        title: 'Food Delivery App',
        description: 'User experience design for a food delivery platform with real-time tracking.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
        category: 'Mobile App Design'
      }
    ],
    reviews: [
      {
        id: '1',
        reviewerName: 'Rahul Mehta',
        reviewerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        rating: 5,
        comment: 'Priya delivered an exceptional mobile app design that exceeded our expectations. Her attention to detail and user-centered approach resulted in a 40% increase in user engagement.',
        date: '2024-01-15',
        projectTitle: 'E-commerce Mobile App Redesign',
        helpful: 12,
        verified: true
      },
      {
        id: '2',
        reviewerName: 'Anita Desai',
        reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        rating: 5,
        comment: 'Working with Priya was a pleasure. She understood our brand perfectly and created a stunning website that perfectly represents our company values.',
        date: '2024-02-20',
        projectTitle: 'Corporate Website Design',
        helpful: 8,
        verified: true
      },
      {
        id: '3',
        reviewerName: 'Vikram Singh',
        reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        rating: 4,
        comment: 'Great communication and timely delivery. The design was modern and user-friendly. Would definitely recommend!',
        date: '2024-03-10',
        projectTitle: 'Restaurant Booking App',
        helpful: 5,
        verified: true
      }
    ]
  },
  // Add more freelancers with similar detailed data...
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
    responseTime: '1 hour',
    about: 'I am a seasoned full-stack developer with 7+ years of experience building scalable web applications. I specialize in modern JavaScript frameworks, cloud architecture, and microservices. My expertise includes React, Node.js, Python, and AWS cloud services.',
    education: [
      {
        degree: 'Bachelor of Technology in Computer Science',
        institution: 'Pune University',
        year: '2017'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'MongoDB Certified Developer',
      'React Advanced Patterns'
    ],
    portfolioItems: [
      {
        id: '1',
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with React frontend and Node.js backend.',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
        category: 'Web Development'
      }
    ],
    reviews: [
      {
        id: '1',
        reviewerName: 'Sneha Gupta',
        reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        rating: 5,
        comment: 'Arjun is an exceptional developer. He delivered our e-commerce platform on time and exceeded all requirements.',
        date: '2024-01-20',
        projectTitle: 'E-commerce Platform Development',
        helpful: 15,
        verified: true
      }
    ]
  }
];

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { saveProfile, removeProfile, isSaved } = useSavedProfiles();
  const [activeTab, setActiveTab] = useState('overview');
  
  const freelancer = freelancers.find(f => f.id === id);
  
  if (!freelancer) {
    return (
      <div className="pt-32 pb-20">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Freelancer not found</h1>
          <p className="text-muted-foreground mb-6">
            The freelancer you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/freelancers">Browse Freelancers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const saved = isSaved(freelancer.id);
  
  const handleSave = () => {
    if (saved) {
      removeProfile(freelancer.id);
      toast({
        title: 'Profile removed',
        description: `${freelancer.name} has been removed from your saved profiles.`
      });
    } else {
      saveProfile({ 
        id: freelancer.id, 
        name: freelancer.name, 
        avatar: freelancer.avatar, 
        title: freelancer.title 
      });
      toast({
        title: 'Profile saved',
        description: `${freelancer.name} has been added to your saved profiles.`
      });
    }
  };

  const handleContact = () => {
    // Navigate to contact page for this freelancer
    window.location.href = `/contact/${freelancer.id}`;
  };

  const handleHire = () => {
    toast({
      title: 'Hire process started',
      description: `You can now proceed to hire ${freelancer.name}.`
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={`${
          i < rating ? 'text-amber-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/freelancers" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Freelancers
          </Link>
        </div>

        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <img 
                    src={freelancer.avatar} 
                    alt={freelancer.name} 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{freelancer.name}</h1>
                        <p className="text-xl text-muted-foreground mb-3">{freelancer.title}</p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center">
                            {renderStars(freelancer.rating)}
                            <span className="ml-2 font-medium">{freelancer.rating}</span>
                            <span className="text-muted-foreground ml-1">({freelancer.reviewCount} reviews)</span>
                          </div>
                          
                          <div className="flex items-center text-muted-foreground">
                            <MapPin size={16} className="mr-1" />
                            {freelancer.location}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={handleSave}
                        >
                          <Bookmark size={18} className={saved ? "fill-current" : ""} />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 size={18} />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{freelancer.completedProjects}</div>
                        <div className="text-sm text-muted-foreground">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{freelancer.experience}</div>
                        <div className="text-sm text-muted-foreground">Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{freelancer.responseTime}</div>
                        <div className="text-sm text-muted-foreground">Response Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">₹{freelancer.hourlyRate.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Per Hour</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {freelancer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Action Card */}
          <div className="lg:col-span-1">
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      ₹{freelancer.hourlyRate.toLocaleString()}
                    </div>
                    <div className="text-muted-foreground">per hour</div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full" onClick={handleHire}>
                      <DollarSign size={16} className="mr-2" />
                      Hire Now
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleContact}>
                      <MessageSquare size={16} className="mr-2" />
                      Send Message
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t space-y-3">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => window.open(freelancer.portfolio, '_blank')}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Portfolio
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => window.open(`mailto:${freelancer.email}`, '_blank')}
                    >
                      <Mail size={16} className="mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={() => window.open(`tel:${freelancer.phone}`, '_blank')}
                    >
                      <Phone size={16} className="mr-2" />
                      Call Now
                    </Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <CheckCircle size={16} className="text-green-500" />
                      Available for new projects
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      Responds in {freelancer.responseTime}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>About {freelancer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {freelancer.about}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award size={20} />
                    Education & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {freelancer.education?.map((edu, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-muted-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.year}</p>
                    </div>
                  ))}
                  
                  {freelancer.certifications?.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={20} />
                    Languages & Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.languages?.map((lang, index) => (
                        <Badge key={index} variant="outline">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
                <p className="text-muted-foreground">
                  Recent work and projects completed by {freelancer.name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freelancer.portfolioItems?.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-3">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <p className="text-muted-foreground">
                  What clients say about working with {freelancer.name}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freelancer.reviews?.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Detailed Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">About Me</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {freelancer.about}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Work Experience</h4>
                  <p className="text-muted-foreground">
                    {freelancer.experience} of professional experience in {freelancer.title.toLowerCase()}.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Availability</h4>
                  <p className="text-muted-foreground">
                    {freelancer.availability}. I typically respond to messages within {freelancer.responseTime}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
