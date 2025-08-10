import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, ThumbsDown, ArrowLeft, Mail, Phone, MapPin, Star, Clock, ExternalLink, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Badge } from '@/components/ui/badge';

type ChatEntry = {
  text: string;
  sender: 'user' | 'bot';
  feedbackGiven?: boolean;
};

// Enhanced freelancer data (same as in Freelancers.tsx)
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
  // Add more freelancers here...
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
  }
];

// --- New Function to Call Gemini API ---
const getGeminiReply = async (userInput: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key is not set in environment variables.");
    return "Sorry, my connection to the AI service is not configured correctly.";
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a helpful support bot for Empleadora, a freelancing platform.
Your goal is to assist users with questions about the platform.
Keep answers concise, clear, and under 60 words.

Facts about Empleadora:

All freelancers are verified and skilled. Users can view profiles and reviews before hiring.

To hire, visit a freelancer's profile and click "Hire Now" or send a direct message.

Payments are processed securely through Empleadora and released only when the work is confirmed complete.

For direct support, email dkrdanet@gmail.com.

Now, please answer the following user question: "${userInput}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching Gemini reply:", error);
    return "Oops! I'm having a little trouble thinking right now. Please try again in a moment.";
  }
};

// --- The Main Component (with modifications) ---
const ChatMessage = ({
  message,
  sender,
  feedbackGiven,
  onFeedback,
}: {
  message: string;
  sender: 'user' | 'bot';
  feedbackGiven?: boolean;
  onFeedback?: (type: 'up' | 'down') => void;
}) => (
  <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
    <div
      className={`px-4 py-2 rounded-2xl max-w-xs ${
        sender === 'user'
          ? 'bg-primary text-primary-foreground rounded-br-none'
          : 'bg-muted text-foreground rounded-bl-none'
      }`}
    >
      <div>{message}</div>
      {sender === 'bot' && onFeedback && !feedbackGiven && (
        <div className="flex justify-end gap-2 mt-2 text-muted-foreground text-sm">
          <button onClick={() => onFeedback('up')} aria-label="Thumbs up">
            <ThumbsUp size={16} />
          </button>
          <button onClick={() => onFeedback('down')} aria-label="Thumbs down">
            <ThumbsDown size={16} />
          </button>
        </div>
      )}
      {feedbackGiven && (
        <div className="text-xs text-right mt-2 text-green-500">Thanks for the feedback!</div>
      )}
    </div>
  </div>
);

const Contact = () => {
  const { id } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<ChatEntry[]>([
    {
      text: 'Hi! I\'m your freelance assistant bot. Ask me anything about the site or freelancers.',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Find the freelancer if ID is provided
  const freelancer = id ? freelancers.find(f => f.id === id) : null;

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatEntry = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    const currentInput = input;
    setInput('');

    const reply = await getGeminiReply(currentInput);

    const botMsg: ChatEntry = { text: reply, sender: 'bot', feedbackGiven: false };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  const handleFeedback = (index: number, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, feedbackGiven: true } : msg
      )
    );

    toast({
      title: 'Thanks for your feedback!',
      description: type === 'up'
        ? 'Glad I could help! 👍'
        : 'Noted. I\'m always learning. 👀',
    });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message sent!',
      description: `Your message has been sent to ${freelancer?.name}. They will respond within ${freelancer?.responseTime}.`,
    });
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  // If freelancer ID is provided, show individual contact page
  if (freelancer) {
    return (
      <div className="pt-32 pb-20">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="mb-6">
            <Link to="/contact" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} className="mr-2" />
              Back to Support
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Freelancer Profile */}
            <div className="lg:col-span-1">
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <img 
                      src={freelancer.avatar} 
                      alt={freelancer.name} 
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-xl">{freelancer.name}</CardTitle>
                      <p className="text-muted-foreground">{freelancer.title}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star size={16} className="text-amber-500" />
                    <span className="font-medium">{freelancer.rating}</span>
                    <span className="text-muted-foreground">({freelancer.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={16} />
                    {freelancer.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    Responds in {freelancer.responseTime}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">{freelancer.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">{freelancer.experience}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Projects:</span>
                        <span className="font-medium">{freelancer.completedProjects} completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Rate:</span>
                        <span className="font-medium">₹{freelancer.hourlyRate.toLocaleString()}/hr</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {freelancer.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.open(freelancer.portfolio, '_blank')}
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View Portfolio
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.open(`mailto:${freelancer.email}`, '_blank')}
                    >
                      <Mail size={16} className="mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => window.open(`tel:${freelancer.phone}`, '_blank')}
                    >
                      <Phone size={16} className="mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Send Message to {freelancer.name}</CardTitle>
                  <p className="text-muted-foreground">
                    Describe your project requirements and {freelancer.name} will get back to you within {freelancer.responseTime}.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Name</label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        placeholder="Project title or brief description"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Describe your project requirements, timeline, budget, and any specific questions..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      <Send size={16} className="mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default chat bot interface
  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto max-w-2xl">
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="text-2xl">Chat with Support Bot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div ref={chatContainerRef} className="h-96 overflow-y-auto p-2 border rounded-md bg-muted/50">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  message={msg.text}
                  sender={msg.sender}
                  feedbackGiven={msg.feedbackGiven}
                  onFeedback={
                    msg.sender === 'bot' && !msg.feedbackGiven
                      ? (type) => handleFeedback(idx, type)
                      : undefined
                  }
                />
              ))}
              {isTyping && (
                <div className="text-muted-foreground text-sm italic p-2">Bot is typing...</div>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isTyping}
              />
              <Button onClick={handleSend} disabled={isTyping || !input.trim()}>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;