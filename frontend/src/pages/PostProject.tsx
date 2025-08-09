
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Clock, 
  Briefcase,
  Upload,
  Eye,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const projectFormSchema = z.object({
  title: z.string().min(10, { message: 'Title must be at least 10 characters' }),
  description: z.string().min(50, { message: 'Description must be at least 50 characters' }),
  category: z.string().min(1, { message: 'Please select a category' }),
  projectType: z.enum(['one-time', 'ongoing', 'milestone'], { required_error: 'Please select a project type' }),
  budgetType: z.enum(['fixed', 'hourly'], { required_error: 'Please select a budget type' }),
  budgetMin: z.string().min(1, { message: 'Please enter a minimum budget' }),
  budgetMax: z.string().min(1, { message: 'Please enter a maximum budget' }),
  duration: z.string().min(1, { message: 'Please select a duration' }),
  location: z.string().min(1, { message: 'Please specify location preference' }),
  skills: z.string().min(3, { message: 'Please enter required skills' }),
  experienceLevel: z.enum(['entry', 'intermediate', 'expert'], { required_error: 'Please select experience level' }),
  isUrgent: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  attachments: z.string().optional(),
  requirements: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

const categories = [
  { value: 'web-development', label: 'Web Development', icon: '🌐' },
  { value: 'mobile-development', label: 'Mobile Development', icon: '📱' },
  { value: 'design', label: 'Design & Creative', icon: '🎨' },
  { value: 'writing', label: 'Writing & Translation', icon: '✍️' },
  { value: 'marketing', label: 'Digital Marketing', icon: '📈' },
  { value: 'video', label: 'Video & Animation', icon: '🎬' },
  { value: 'audio', label: 'Music & Audio', icon: '🎵' },
  { value: 'business', label: 'Business & Consulting', icon: '💼' },
  { value: 'programming', label: 'Programming & Tech', icon: '💻' },
  { value: 'data', label: 'Data Science & AI', icon: '🤖' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'legal', label: 'Legal Services', icon: '⚖️' },
];

const projectTypes = [
  { value: 'one-time', label: 'One-time Project', description: 'Single project with clear deliverables' },
  { value: 'ongoing', label: 'Ongoing Work', description: 'Long-term collaboration or maintenance' },
  { value: 'milestone', label: 'Milestone-based', description: 'Project with multiple phases and milestones' },
];

const durations = [
  { value: 'less-than-1-week', label: 'Less than 1 week' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '2-4-weeks', label: '2-4 weeks' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: 'more-than-6-months', label: 'More than 6 months' },
  { value: 'ongoing', label: 'Ongoing project' },
];

const experienceLevels = [
  { value: 'entry', label: 'Entry Level', description: '0-2 years experience' },
  { value: 'intermediate', label: 'Intermediate', description: '2-5 years experience' },
  { value: 'expert', label: 'Expert', description: '5+ years experience' },
];

const popularSkills = [
  'React', 'Node.js', 'Python', 'JavaScript', 'PHP', 'WordPress', 'UI/UX Design',
  'Graphic Design', 'Content Writing', 'SEO', 'Social Media Marketing', 'Video Editing',
  'Mobile App Development', 'Data Analysis', 'Machine Learning', 'AWS', 'Docker'
];

const PostProject = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Redirect if not logged in
  if (!user?.isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      projectType: 'one-time',
      budgetType: 'fixed',
      budgetMin: '',
      budgetMax: '',
      duration: '',
      location: '',
      skills: '',
      experienceLevel: 'intermediate',
      isUrgent: false,
      isFeatured: false,
      attachments: '',
      requirements: '',
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    console.log('Project data:', data);
    
    toast({
      title: 'Project posted successfully! 🎉',
      description: 'Your project is now live and visible to talented freelancers across India',
    });
    
    navigate('/projects');
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      form.setValue('skills', [...selectedSkills, skill].join(', '));
    }
  };

  const removeSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(updatedSkills);
    form.setValue('skills', updatedSkills.join(', '));
  };

  const steps = [
    { number: 1, title: 'Basic Details', description: 'Project title and description' },
    { number: 2, title: 'Requirements', description: 'Category, skills, and experience' },
    { number: 3, title: 'Budget & Timeline', description: 'Budget range and duration' },
    { number: 4, title: 'Review & Post', description: 'Final review and submission' },
  ];

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto max-w-5xl">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Project</h1>
          <p className="text-muted-foreground">
            Describe your project to find the perfect freelancer from India's top talent pool
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  currentStep >= step.number 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-2",
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Details
            </CardTitle>
            <CardDescription>
              Provide detailed information to attract the right talents for your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Step 1: Basic Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <h3 className="text-lg font-semibold">Basic Project Information</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Project Title *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g. WordPress Website Development for a Real Estate Agency"
                            className="text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Project Description *
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            placeholder="Describe your project in detail, including goals, requirements, and any specific details freelancers should know. Be as detailed as possible to attract the right talent."
                            className="min-h-32"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Project Type *
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projectTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{type.label}</span>
                                    <span className="text-xs text-muted-foreground">{type.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location Preference *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              placeholder="e.g. Remote, Mumbai, Bangalore, or Anywhere in India"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Step 2: Requirements */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <h3 className="text-lg font-semibold">Requirements & Skills</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center gap-2">
                                    <span>{category.icon}</span>
                                    <span>{category.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienceLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{level.label}</span>
                                    <span className="text-xs text-muted-foreground">{level.description}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Required Skills *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder="e.g. WordPress, PHP, Web Design, MySQL"
                            onChange={(e) => {
                              field.onChange(e);
                              const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                              setSelectedSkills(skills);
                            }}
                          />
                        </FormControl>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-2">Popular skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {popularSkills.map((skill) => (
                              <Badge
                                key={skill}
                                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                                className="cursor-pointer hover:bg-primary/10"
                                onClick={() => addSkill(skill)}
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedSkills.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground mb-2">Selected skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedSkills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="default"
                                  className="cursor-pointer"
                                  onClick={() => removeSkill(skill)}
                                >
                                  {skill} ×
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Requirements (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field}
                            placeholder="Any specific requirements, preferences, or additional information for freelancers..."
                            className="min-h-20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 3: Budget & Timeline */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <h3 className="text-lg font-semibold">Budget & Timeline</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="budgetType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Budget Type *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                              <RadioGroupItem value="fixed" id="fixed" />
                              <label htmlFor="fixed" className="flex flex-col">
                                <span className="font-medium">Fixed Price</span>
                                <span className="text-sm text-muted-foreground">Set a total project budget</span>
                              </label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50">
                              <RadioGroupItem value="hourly" id="hourly" />
                              <label htmlFor="hourly" className="flex flex-col">
                                <span className="font-medium">Hourly Rate</span>
                                <span className="text-sm text-muted-foreground">Pay per hour of work</span>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="budgetMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Budget (₹) *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" placeholder="5000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="budgetMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Budget (₹) *</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" placeholder="15000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Expected Duration *
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {durations.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Step 4: Additional Options */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <h3 className="text-lg font-semibold">Additional Options</h3>
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="isUrgent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-orange-500" />
                              Mark as Urgent
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              This will make your project appear at the top of search results and notify freelancers
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-blue-500" />
                              Feature This Project
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Your project will be highlighted and shown to more freelancers
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Attachments (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field}
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.png,.zip"
                            className="cursor-pointer"
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Upload project files, reference materials, or examples (max 10MB)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-blue-600" size={16} />
                    <span className="font-medium text-blue-800">Secure Escrow Protection</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your payment will be held securely in escrow until you approve the completed work. 
                    This protects both you and the freelancer throughout the project.
                  </p>
                </div>
                
                <div className="flex justify-between gap-3 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" className="px-8">
                    <FileText className="mr-2" size={16} />
                    Post Project
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostProject;
