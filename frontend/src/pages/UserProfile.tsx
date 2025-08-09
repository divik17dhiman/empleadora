
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/hooks/use-toast';
import { Shield, User } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  userType: z.enum(['client', 'freelancer', 'moderator']),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const freelancerFormSchema = z.object({
  professionalTitle: z.string().min(3, { message: 'Professional title is required' }),
  skills: z.string().min(3, { message: 'Please enter at least one skill' }),
  hourlyRate: z.string().min(1, { message: 'Hourly rate is required' }),
  languages: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
});

type FreelancerFormData = z.infer<typeof freelancerFormSchema>;

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  const user=JSON.parse(localStorage.getItem('user'));
  // Redirect if not logged in
  if (!user?.isLoggedIn) {
    navigate('/login');
    return null;
  }
  
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
      location: '',
      website: '',
      userType: user?.userType || 'client',
    },
  });
  
  const freelancerForm = useForm<FreelancerFormData>({
    resolver: zodResolver(freelancerFormSchema),
    defaultValues: {
      professionalTitle: '',
      skills: '',
      hourlyRate: '',
      languages: '',
      education: '',
      experience: '',
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfile({
      name: data.name,
      email: data.email,
      userType: data.userType
    });
    
    toast({
      title: 'Profile updated',
      description: 'Your profile has been successfully updated',
    });
  };
  
  const onFreelancerSubmit = (data: FreelancerFormData) => {
    // In a real app, this would update freelancer-specific fields
    updateProfile({ userType: 'freelancer' });
    
    toast({
      title: 'Freelancer profile updated',
      description: 'Your freelancer profile has been successfully updated',
    });
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto max-w-4xl">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        
        <Tabs defaultValue="profile" onValueChange={setActiveTab}>
          <div className="card-elevated rounded-lg border p-1 subtle-shadow mb-8">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="profile">General Profile</TabsTrigger>
              <TabsTrigger value="freelancer">
                {user.userType === 'freelancer' 
                  ? 'Freelancer Profile' 
                  : 'Register as Freelancer'}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>General Profile</CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center relative group">
                        {user.avatar ? (
                          <img 
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User size={36} className="text-muted-foreground" />
                        )}
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <span className="text-white text-xs font-medium">Upload Photo</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm mt-1">{
                          user.userType === 'client' 
                            ? 'Client Account' 
                            : user.userType === 'freelancer' 
                              ? 'Freelancer Account' 
                              : 'Moderator Account'
                        }</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="City, Country" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="https://yourdomain.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={profileForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Tell us a bit about yourself" 
                              className="min-h-24"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Account Type</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="client" id="profile-client" />
                                <label htmlFor="profile-client" className="text-sm font-medium leading-none">
                                  Client (I want to hire)
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="freelancer" id="profile-freelancer" />
                                <label htmlFor="profile-freelancer" className="text-sm font-medium leading-none">
                                  Freelancer (I want to work)
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="moderator" id="profile-moderator" />
                                <label htmlFor="profile-moderator" className="text-sm font-medium leading-none flex items-center">
                                  Moderator <Shield size={14} className="ml-1 text-amber-500" />
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Changes</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="freelancer">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>
                  {user.userType === 'freelancer' 
                    ? 'Freelancer Profile' 
                    : 'Register as Freelancer'}
                </CardTitle>
                <CardDescription>
                  {user.userType === 'freelancer'
                    ? 'Update your freelancer profile information'
                    : 'Complete your freelancer profile to start offering your services'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...freelancerForm}>
                  <form onSubmit={freelancerForm.handleSubmit(onFreelancerSubmit)} className="space-y-6">
                    <FormField
                      control={freelancerForm.control}
                      name="professionalTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. UI/UX Designer, Web Developer, Content Writer" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={freelancerForm.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills (comma separated)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. JavaScript, React, UI Design" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={freelancerForm.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate ($)</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="1" placeholder="45" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={freelancerForm.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Languages (comma separated)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. English (Fluent), Spanish (Conversational)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={freelancerForm.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Your educational background" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={freelancerForm.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Experience</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Your relevant work experience" 
                              className="min-h-32"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit">
                        {user.userType === 'freelancer' 
                          ? 'Update Freelancer Profile'
                          : 'Register as Freelancer'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
