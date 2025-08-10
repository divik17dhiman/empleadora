import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Eye,
  Calendar,
  DollarSign,
  User,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Milestone {
  id: number;
  mid: number;
  title: string;
  description: string;
  amount_wei: string;
  dueDate: string;
  status: 'pending' | 'funded' | 'completed' | 'released';
  deliverable_cid?: string;
  funded_tx_hash?: string;
  released_tx_hash?: string;
  project: {
    id: number;
    onchain_pid: string;
    client_wallet: string;
    freelancer_wallet: string;
  };
}

const MilestoneManagement = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Sample data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from the API
    setMilestones([
      {
        id: 1,
        mid: 0,
        title: 'Wireframes & User Flow',
        description: 'Create wireframes and user flow diagrams for the mobile app',
        amount_wei: '25.0',
        dueDate: '2025-01-15',
        status: 'completed',
        deliverable_cid: 'QmX...abc123',
        project: {
          id: 1,
          onchain_pid: '123',
          client_wallet: '0x1234567890abcdef',
          freelancer_wallet: '0xfedcba0987654321'
        }
      },
      {
        id: 2,
        mid: 1,
        title: 'UI Design & Prototype',
        description: 'Complete UI design with interactive prototype',
        amount_wei: '35.0',
        dueDate: '2025-01-20',
        status: 'funded',
        funded_tx_hash: '0xabc...def456',
        project: {
          id: 1,
          onchain_pid: '123',
          client_wallet: '0x1234567890abcdef',
          freelancer_wallet: '0xfedcba0987654321'
        }
      },
      {
        id: 3,
        mid: 2,
        title: 'Final Delivery & Documentation',
        description: 'Final app delivery with complete documentation',
        amount_wei: '25.0',
        dueDate: '2025-01-25',
        status: 'pending',
        project: {
          id: 1,
          onchain_pid: '123',
          client_wallet: '0x1234567890abcdef',
          freelancer_wallet: '0xfedcba0987654321'
        }
      }
    ]);
  }, []);

  const handleFileUpload = async (milestoneId: number) => {
    if (!uploadFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert file to base64 for demo
      const reader = new FileReader();
      reader.onload = async () => {
        const base64File = reader.result as string;
        
        const response = await fetch(`http://localhost:3001/milestones/${milestoneId}/deliver`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            file: base64File
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload deliverable');
        }

        const result = await response.json();
        
        // Update milestone status
        setMilestones(milestones.map(m => 
          m.id === milestoneId 
            ? { ...m, status: 'completed', deliverable_cid: result.cid }
            : m
        ));

        toast({
          title: "Success",
          description: "Deliverable uploaded successfully!",
        });
        
        setUploadFile(null);
        setSelectedMilestone(null);
      };
      reader.readAsDataURL(uploadFile);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload deliverable. Please try again.",
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
        return <Badge variant="default" className="bg-blue-500">Completed</Badge>;
      case 'released':
        return <Badge variant="default" className="bg-green-500">Released</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'funded':
        return <DollarSign className="text-green-500" size={20} />;
      case 'completed':
        return <CheckCircle className="text-blue-500" size={20} />;
      case 'released':
        return <Shield className="text-green-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-500" size={20} />;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Milestone Management</h1>
            <p className="text-muted-foreground">
              Track and manage project milestones and deliverables
            </p>
          </div>
          <Button onClick={() => setActiveTab('overview')}>
            <Eye className="mr-2" size={16} />
            View All Milestones
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
            <TabsTrigger value="tracking">Progress Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Milestones</p>
                      <h3 className="text-2xl font-bold">{milestones.length}</h3>
                    </div>
                    <FileText className="text-blue-500" size={24} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Funded</p>
                      <h3 className="text-2xl font-bold">
                        {milestones.filter(m => m.status === 'funded').length}
                      </h3>
                    </div>
                    <DollarSign className="text-green-500" size={24} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <h3 className="text-2xl font-bold">
                        {milestones.filter(m => m.status === 'completed').length}
                      </h3>
                    </div>
                    <CheckCircle className="text-blue-500" size={24} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Released</p>
                      <h3 className="text-2xl font-bold">
                        {milestones.filter(m => m.status === 'released').length}
                      </h3>
                    </div>
                    <Shield className="text-green-500" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Milestones List */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>All Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(milestone.status)}
                          <div>
                            <h3 className="font-medium">{milestone.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Project #{milestone.project.onchain_pid} • Milestone {milestone.mid + 1}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(milestone.status)}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedMilestone(milestone)}
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {milestone.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-medium">{milestone.amount_wei} AVAX</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className={`font-medium ${isOverdue(milestone.dueDate) ? 'text-red-500' : ''}`}>
                            {new Date(milestone.dueDate).toLocaleDateString()}
                            {isOverdue(milestone.dueDate) && <span className="ml-1">(Overdue)</span>}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Client</p>
                          <p className="font-mono text-xs">
                            {milestone.project.client_wallet.slice(0, 8)}...{milestone.project.client_wallet.slice(-6)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Freelancer</p>
                          <p className="font-mono text-xs">
                            {milestone.project.freelancer_wallet.slice(0, 8)}...{milestone.project.freelancer_wallet.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliverables" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Deliverable Management</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMilestone ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{selectedMilestone.title}</h3>
                        <p className="text-muted-foreground">{selectedMilestone.description}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedMilestone(null)}
                      >
                        Close
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Upload Deliverable */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Upload size={20} />
                            Upload Deliverable
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="file-upload">Select File</Label>
                            <Input
                              id="file-upload"
                              type="file"
                              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                              accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.png,.fig,.sketch"
                            />
                          </div>
                          
                          {uploadFile && (
                            <div className="p-3 bg-secondary rounded-lg">
                              <p className="text-sm font-medium">{uploadFile.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Size: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          )}
                          
                          <Button 
                            onClick={() => handleFileUpload(selectedMilestone.id)}
                            disabled={!uploadFile || loading}
                            className="w-full"
                          >
                            {loading ? 'Uploading...' : 'Upload Deliverable'}
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Deliverable Status */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Download size={20} />
                            Deliverable Status
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Status:</span>
                              {getStatusBadge(selectedMilestone.status)}
                            </div>
                            
                            {selectedMilestone.deliverable_cid && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">IPFS CID:</p>
                                <p className="text-xs font-mono bg-secondary p-2 rounded">
                                  {selectedMilestone.deliverable_cid}
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                  <Download className="mr-2" size={16} />
                                  Download Deliverable
                                </Button>
                              </div>
                            )}
                            
                            {selectedMilestone.funded_tx_hash && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Funding Transaction:</p>
                                <p className="text-xs font-mono bg-secondary p-2 rounded">
                                  {selectedMilestone.funded_tx_hash}
                                </p>
                              </div>
                            )}
                            
                            {selectedMilestone.released_tx_hash && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Release Transaction:</p>
                                <p className="text-xs font-mono bg-secondary p-2 rounded">
                                  {selectedMilestone.released_tx_hash}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto text-muted-foreground" size={48} />
                    <p className="text-muted-foreground mt-2">
                      Select a milestone to manage its deliverables
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative">
                      {index < milestones.length - 1 && (
                        <div className="absolute left-6 top-12 w-0.5 h-12 bg-border" />
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          milestone.status === 'released' ? 'bg-green-100' :
                          milestone.status === 'completed' ? 'bg-blue-100' :
                          milestone.status === 'funded' ? 'bg-green-100' :
                          'bg-gray-100'
                        }`}>
                          {getStatusIcon(milestone.status)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{milestone.title}</h3>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(milestone.status)}
                              <span className="text-sm text-muted-foreground">
                                {milestone.amount_wei} AVAX
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {milestone.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                            <span>Project #{milestone.project.onchain_pid}</span>
                            {milestone.deliverable_cid && (
                              <span className="text-green-600">✓ Delivered</span>
                            )}
                          </div>
                        </div>
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

export default MilestoneManagement;
