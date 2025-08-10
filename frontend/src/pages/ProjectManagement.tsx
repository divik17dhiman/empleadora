import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Users, 
  Calendar, 
  DollarSign, 
  Target, 
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  id?: number;
  mid: number;
  title: string;
  description: string;
  amount_wei: string;
  dueDate: string;
  status: 'pending' | 'funded' | 'completed' | 'released';
}

interface Project {
  id: number;
  onchain_pid: string;
  client: {
    id: number;
    email: string;
    wallet_address: string;
    role: string;
  };
  freelancer: {
    id: number;
    email: string;
    wallet_address: string;
    role: string;
  };
  milestones: Milestone[];
  created_at: string;
  disputed: boolean;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('create');
  const { toast } = useToast();

  // Form state for creating new project
  const [formData, setFormData] = useState({
    onchain_pid: '123456789',
    client_wallet: '',
    title: 'New Project',
    description: 'Project description',
    budget: '1000000000000000000',
    skills: ['React', 'Node.js', 'TypeScript']
  });

  const [milestones, setMilestones] = useState<Omit<Milestone, 'id'>[]>([
    {
      mid: 0,
      title: 'Initial Milestone',
      description: 'First project milestone',
      amount_wei: '1000000000000000000',
      dueDate: '',
      status: 'pending'
    }
  ]);

  // Fetch users and projects on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        // Fetch users
        const usersResponse = await fetch('http://localhost:3001/auth/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        // Fetch projects
        const projectsResponse = await fetch('http://localhost:3001/projects');
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const addMilestone = () => {
    setMilestones([
      ...milestones,
      {
        mid: milestones.length,
        title: '',
        description: '',
        amount_wei: '',
        dueDate: '',
        status: 'pending'
      }
    ]);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  const updateMilestone = (index: number, field: keyof Milestone, value: string) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [field]: value };
    setMilestones(updatedMilestones);
  };

  const handleCreateProject = async () => {
    // Validate required fields
    if (!formData.onchain_pid || !formData.client_wallet) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (On-chain PID, Client Wallet)",
        variant: "destructive",
      });
      return;
    }

    // Validate milestones
    const validMilestones = milestones.filter(m => m.amount_wei && m.amount_wei.trim() !== '');
    if (validMilestones.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one milestone with an amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const amounts_wei = validMilestones.map(m => m.amount_wei);
      
      const response = await fetch('http://localhost:3001/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onchain_pid: formData.onchain_pid,
          client_wallet: formData.client_wallet,
          title: formData.title,
          description: formData.description,
          budget: formData.budget,
          skills: formData.skills,
          amounts_wei
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const newProject = await response.json();
      setProjects([...projects, newProject]);
      
      // Reset form
      setFormData({
        onchain_pid: '123456789',
        client_wallet: '',
        title: 'New Project',
        description: 'Project description',
        budget: '1000000000000000000',
        skills: ['React', 'Node.js', 'TypeScript']
      });
      setMilestones([{
        mid: 0,
        title: 'Initial Milestone',
        description: 'First project milestone',
        amount_wei: '1000000000000000000',
        dueDate: '',
        status: 'pending'
      }]);

      toast({
        title: "Success",
        description: "Project created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'funded':
        return <Badge variant="default">Funded</Badge>;
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'released':
        return <Badge variant="default" className="bg-green-500">Released</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">
              Create and manage projects with milestone-based payments
            </p>
          </div>
          <Button onClick={() => setActiveTab('create')}>
            <Plus className="mr-2" size={16} />
            Create New Project
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create Project</TabsTrigger>
            <TabsTrigger value="manage">Manage Projects</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Details */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="onchain_pid">On-chain Project ID</Label>
                    <Input
                      id="onchain_pid"
                      value={formData.onchain_pid}
                      onChange={(e) => setFormData({...formData, onchain_pid: e.target.value})}
                      placeholder="Enter blockchain project ID"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter project title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget (in wei)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      placeholder="Enter budget in wei"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={formData.skills.join(', ')}
                      onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})}
                      placeholder="React, Node.js, TypeScript"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="client_wallet">Client</Label>
                    <Select value={formData.client_wallet} onValueChange={(value) => setFormData({...formData, client_wallet: value})} disabled={dataLoading}>
                      <SelectTrigger>
                        <SelectValue placeholder={dataLoading ? "Loading..." : "Select a client"} />
                      </SelectTrigger>
                      <SelectContent>
                        {users.filter(user => user.role === 'client').map((user) => (
                          <SelectItem key={user.id} value={user.wallet_address}>
                            {user.email} ({user.wallet_address?.slice(0, 8) || 'N/A'}...)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  

                </CardContent>
              </Card>

              {/* Milestones */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={20} />
                      Milestones
                    </div>
                    <Button variant="outline" size="sm" onClick={addMilestone}>
                      <Plus size={16} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Milestone {index + 1}</h4>
                        {milestones.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                      
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={milestone.title}
                          onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                          placeholder="Milestone title"
                        />
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          placeholder="Milestone description"
                          rows={2}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Amount (AVAX)</Label>
                          <Input
                            type="number"
                            value={milestone.amount_wei}
                            onChange={(e) => updateMilestone(index, 'amount_wei', e.target.value)}
                            placeholder="0.0"
                          />
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <Input
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => updateMilestone(index, 'dueDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={handleCreateProject} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Creating Project...' : 'Create Project'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="text-center py-8">
                    <Target className="mx-auto text-muted-foreground" size={48} />
                    <p className="text-muted-foreground mt-2">Loading projects...</p>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Target className="mx-auto text-muted-foreground" size={48} />
                    <p className="text-muted-foreground mt-2">No projects created yet</p>
                    <Button onClick={() => setActiveTab('create')} className="mt-4">
                      Create Your First Project
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">Project #{project.onchain_pid}</h3>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(project.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye size={16} />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit size={16} />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Client</p>
                            <p className="font-mono text-xs">{project.client?.wallet_address ? `${project.client.wallet_address.slice(0, 8)}...${project.client.wallet_address.slice(-6)}` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Freelancer</p>
                            <p className="font-mono text-xs">{project.freelancer?.wallet_address ? `${project.freelancer.wallet_address.slice(0, 8)}...${project.freelancer.wallet_address.slice(-6)}` : 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Milestones</p>
                            <p>{project.milestones.length}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            {project.disputed ? (
                              <Badge variant="destructive">Disputed</Badge>
                            ) : (
                              <Badge variant="default">Active</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                      <h3 className="text-2xl font-bold">{dataLoading ? '...' : projects.length}</h3>
                    </div>
                    <Target className="text-blue-500" size={24} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <h3 className="text-2xl font-bold">
                        {dataLoading ? '...' : projects.filter(p => !p.disputed).length}
                      </h3>
                    </div>
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Disputed Projects</p>
                      <h3 className="text-2xl font-bold">
                        {dataLoading ? '...' : projects.filter(p => p.disputed).length}
                      </h3>
                    </div>
                    <AlertCircle className="text-red-500" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectManagement;
