import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, DollarSign, Calendar, User, Clock, Send, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Project {
  id: number;
  title: string;
  description: string;
  budget: string;
  skills: string[];
  status: string;
  created_at: string;
  client: {
    id: number;
    email: string;
    wallet_address: string;
  };
  applications: Array<{
    id: number;
    freelancer: {
      id: number;
      email: string;
      wallet_address: string;
    };
  }>;
}

const AvailableProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    proposal: '',
    bid_amount: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery]);

  const fetchAvailableProjects = async () => {
    try {
      const response = await fetch('http://localhost:3001/projects/available');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    const filtered = projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredProjects(filtered);
  };

  const handleApply = async () => {
    if (!selectedProject || !user) return;

    try {
      const response = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedProject.id,
          freelancerId: user.id,
          proposal: applicationForm.proposal,
          bid_amount: applicationForm.bid_amount
        }),
      });

      if (response.ok) {
        toast({
          title: 'Application submitted successfully!',
          description: 'The client will review your proposal.',
        });
        setIsApplyDialogOpen(false);
        setApplicationForm({ proposal: '', bid_amount: '' });
        setSelectedProject(null);
        // Refresh projects to update application count
        fetchAvailableProjects();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to submit application',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive',
      });
    }
  };

  const formatBudget = (budget: string) => {
    const amount = parseFloat(budget) / 1e18; // Convert from wei to AVAX
    return `${amount.toFixed(2)} AVAX`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="pt-24 pb-20">
        <div className="container px-4 mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading available projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Available Projects</h1>
          <p className="text-muted-foreground max-w-2xl">
            Browse and apply to projects that match your skills. Submit your best proposal to win the project.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search projects by title, description, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="card-elevated hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {project.applications.length} applications
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign size={16} />
                    {formatBudget(project.budget)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {formatDate(project.created_at)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-1">
                    {project.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedProject(project);
                      setIsApplyDialogOpen(true);
                    }}
                  >
                    <Send size={16} className="mr-2" />
                    Apply Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProject(project)}
                  >
                    <Eye size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p>Try adjusting your search criteria or check back later for new projects.</p>
            </div>
          </div>
        )}

        {/* Apply Dialog */}
        <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Apply to Project</DialogTitle>
            </DialogHeader>
            {selectedProject && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">{selectedProject.title}</h3>
                  <p className="text-muted-foreground">{selectedProject.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <DollarSign size={16} />
                      Budget: {formatBudget(selectedProject.budget)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={16} />
                      {selectedProject.applications.length} applications
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Proposal</label>
                  <Textarea
                    placeholder="Describe your approach, timeline, and why you're the best fit for this project..."
                    value={applicationForm.proposal}
                    onChange={(e) => setApplicationForm({ ...applicationForm, proposal: e.target.value })}
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Bid (AVAX)</label>
                  <Input
                    type="number"
                    placeholder="Enter your bid amount"
                    value={applicationForm.bid_amount}
                    onChange={(e) => setApplicationForm({ ...applicationForm, bid_amount: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsApplyDialogOpen(false);
                      setApplicationForm({ proposal: '', bid_amount: '' });
                      setSelectedProject(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={!applicationForm.proposal || !applicationForm.bid_amount}
                    className="flex-1"
                  >
                    <Send size={16} className="mr-2" />
                    Submit Application
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AvailableProjects;
