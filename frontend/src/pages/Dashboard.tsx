import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  DollarSign,
  Calendar,
  Star,
  Settings,
  FileText,
  MessageSquare
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const stats = {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 7,
    totalEarnings: 45000,
    pendingPayments: 8500,
    averageRating: 4.8,
    responseTime: '2.3 hours'
  };

  const recentProjects = [
    {
      id: 1,
      title: 'E-commerce Website Development',
      status: 'active',
      progress: 75,
      budget: 5000,
      deadline: '2024-02-15',
      client: 'TechCorp Inc.'
    },
    {
      id: 2,
      title: 'Mobile App UI/UX Design',
      status: 'completed',
      progress: 100,
      budget: 3000,
      deadline: '2024-01-30',
      client: 'StartupXYZ'
    },
    {
      id: 3,
      title: 'Content Writing for Blog',
      status: 'pending',
      progress: 0,
      budget: 800,
      deadline: '2024-02-20',
      client: 'Digital Marketing Co.'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'milestone_completed',
      message: 'Milestone "Design Phase" completed for E-commerce Website',
      time: '2 hours ago',
      icon: <CheckCircle className="w-4 h-4 text-green-500" />
    },
    {
      id: 2,
      type: 'payment_received',
      message: 'Payment received for Mobile App UI/UX Design project',
      time: '1 day ago',
      icon: <DollarSign className="w-4 h-4 text-green-500" />
    },
    {
      id: 3,
      type: 'new_message',
      message: 'New message from TechCorp Inc. regarding project timeline',
      time: '2 days ago',
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="pt-32 pb-20">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {user?.email}! Here's what's happening with your {user?.role === 'client' ? 'projects' : 'work'}.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Badge variant="secondary" className="text-sm">
              {user?.role}
            </Badge>
            <Button asChild>
              <Link to={user?.role === 'client' ? '/post-project' : '/projects'}>
                <Plus className="w-4 h-4 mr-2" />
                {user?.role === 'client' ? 'Post Project' : 'Find Work'}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total {user?.role === 'client' ? 'Projects' : 'Earnings'}</CardTitle>
              {user?.role === 'client' ? (
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              ) : (
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.role === 'client' ? stats.totalProjects : `₹${stats.totalEarnings.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'client' ? 'Active projects' : 'Lifetime earnings'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active {user?.role === 'client' ? 'Projects' : 'Work'}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'client' ? 'Completed' : 'Rating'}
              </CardTitle>
              {user?.role === 'client' ? (
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Star className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.role === 'client' ? stats.completedProjects : stats.averageRating}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'client' ? 'Projects completed' : 'Average rating'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'client' ? 'Pending Payments' : 'Response Time'}
              </CardTitle>
              {user?.role === 'client' ? (
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Clock className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.role === 'client' ? `₹${stats.pendingPayments.toLocaleString()}` : stats.responseTime}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.role === 'client' ? 'Awaiting release' : 'Average response'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Recent {user?.role === 'client' ? 'Projects' : 'Work'}
                  </CardTitle>
                  <CardDescription>
                    Your latest {user?.role === 'client' ? 'projects' : 'assignments'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentProjects.slice(0, 3).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{project.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {user?.role === 'client' ? project.client : `Budget: ₹${project.budget}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : project.status === 'active' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {project.status}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {project.progress}% complete
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={user?.role === 'client' ? '/project-management' : '/milestone-management'}>
                      View All {user?.role === 'client' ? 'Projects' : 'Work'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest updates and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      {activity.icon}
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All {user?.role === 'client' ? 'Projects' : 'Work'}</CardTitle>
                <CardDescription>
                  Manage your {user?.role === 'client' ? 'projects' : 'assignments'} and track progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {user?.role === 'client' ? project.client : `Budget: ₹${project.budget}`}
                          </p>
                        </div>
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : project.status === 'active' ? 'secondary' : 'outline'}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Deadline: {project.deadline}</span>
                          <span>Budget: ₹{project.budget}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>
                  Complete history of your activities and interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-4 border rounded-lg">
                      {activity.icon}
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
