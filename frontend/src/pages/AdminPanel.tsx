import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle, 
  Clock,
  Eye,
  Settings,
  Activity,
  Users,
  FileText,
  ArrowLeftRight,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: number;
  onchain_pid: string;
  client_wallet: string;
  freelancer_wallet: string;
  disputed: boolean;
  created_at: string;
  milestones: {
    id: number;
    mid: number;
    amount_wei: string;
    funded: boolean;
    released: boolean;
  }[];
}

interface ContractStatus {
  contract_address: string;
  network_name: string;
  network_chain_id: string;
  contract_deployed: boolean;
  admin_wallet: string;
  admin_balance_eth: string;
  contract_code_size: number;
}

const AdminPanel = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractStatus, setContractStatus] = useState<ContractStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();

  // Form state for dispute and refund
  const [disputeForm, setDisputeForm] = useState({
    pid: '',
    reason: ''
  });

  const [refundForm, setRefundForm] = useState({
    pid: '',
    mid: ''
  });

  // Sample data for demonstration
  useEffect(() => {
    setProjects([
      {
        id: 1,
        onchain_pid: '123',
        client_wallet: '0x1234567890abcdef',
        freelancer_wallet: '0xfedcba0987654321',
        disputed: true,
        created_at: '2025-01-01T00:00:00Z',
        milestones: [
          { id: 1, mid: 0, amount_wei: '25.0', funded: true, released: false },
          { id: 2, mid: 1, amount_wei: '35.0', funded: true, released: false },
          { id: 3, mid: 2, amount_wei: '25.0', funded: false, released: false }
        ]
      },
      {
        id: 2,
        onchain_pid: '124',
        client_wallet: '0xabcdef1234567890',
        freelancer_wallet: '0x0987654321fedcba',
        disputed: false,
        created_at: '2025-01-05T00:00:00Z',
        milestones: [
          { id: 4, mid: 0, amount_wei: '50.0', funded: true, released: true },
          { id: 5, mid: 1, amount_wei: '30.0', funded: false, released: false }
        ]
      }
    ]);

    setContractStatus({
      contract_address: '0x1234567890abcdef1234567890abcdef12345678',
      network_name: 'Avalanche Fuji',
      network_chain_id: '43113',
      contract_deployed: true,
      admin_wallet: '0xadmin1234567890abcdef1234567890abcdef',
      admin_balance_eth: '10.5',
      contract_code_size: 2048
    });
  }, []);

  const checkContractStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/admin/status');
      if (!response.ok) {
        throw new Error('Failed to check contract status');
      }
      const status = await response.json();
      setContractStatus(status);
      toast({
        title: "Success",
        description: "Contract status updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check contract status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const raiseDispute = async () => {
    if (!disputeForm.pid) {
      toast({
        title: "Error",
        description: "Please enter a project ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/admin/dispute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pid: disputeForm.pid
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to raise dispute');
      }

      const result = await response.json();
      
      // Update project status
      setProjects(projects.map(p => 
        p.onchain_pid === disputeForm.pid 
          ? { ...p, disputed: true }
          : p
      ));

      toast({
        title: "Success",
        description: `Dispute raised successfully! Transaction: ${result.tx}`,
      });

      setDisputeForm({ pid: '', reason: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to raise dispute",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processRefund = async () => {
    if (!refundForm.pid || !refundForm.mid) {
      toast({
        title: "Error",
        description: "Please enter both project ID and milestone ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/admin/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pid: refundForm.pid,
          mid: refundForm.mid
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process refund');
      }

      const result = await response.json();
      
      // Update milestone status
      setProjects(projects.map(p => 
        p.onchain_pid === refundForm.pid 
          ? {
              ...p,
              milestones: p.milestones.map(m => 
                m.mid === parseInt(refundForm.mid) 
                  ? { ...m, released: true }
                  : m
              )
            }
          : p
      ));

      toast({
        title: "Success",
        description: `Refund processed successfully! Transaction: ${result.tx}`,
      });

      setRefundForm({ pid: '', mid: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process refund",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (disputed: boolean) => {
    return disputed ? (
      <Badge variant="destructive">Disputed</Badge>
    ) : (
      <Badge variant="default">Active</Badge>
    );
  };

  return (
    <div className="pt-20 pb-8">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage disputes, refunds, and contract operations
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={checkContractStatus} disabled={loading}>
              <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={16} />
              Check Status
            </Button>
            <Button onClick={() => setActiveTab('overview')}>
              <Shield className="mr-2" size={16} />
              Admin Dashboard
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="refunds">Refunds</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Projects</p>
                      <h3 className="text-2xl font-bold">{projects.length}</h3>
                    </div>
                    <FileText className="text-blue-500" size={24} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Disputed Projects</p>
                      <h3 className="text-2xl font-bold">
                        {projects.filter(p => p.disputed).length}
                      </h3>
                    </div>
                    <AlertTriangle className="text-red-500" size={24} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <h3 className="text-2xl font-bold">
                        {projects.filter(p => !p.disputed).length}
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
                      <p className="text-sm text-muted-foreground">Admin Balance</p>
                      <h3 className="text-2xl font-bold">
                        {contractStatus?.admin_balance_eth || '0'} AVAX
                      </h3>
                    </div>
                    <DollarSign className="text-green-500" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects List */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">Project #{project.onchain_pid}</h3>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(project.disputed)}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedProject(project)}
                          >
                            <Eye size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Client</p>
                          <p className="font-mono text-xs">{project.client_wallet.slice(0, 8)}...{project.client_wallet.slice(-6)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Freelancer</p>
                          <p className="font-mono text-xs">{project.freelancer_wallet.slice(0, 8)}...{project.freelancer_wallet.slice(-6)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Milestones</p>
                          <p>{project.milestones.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Funded</p>
                          <p>{project.milestones.filter(m => m.funded).length}/{project.milestones.length}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Raise Dispute */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle size={20} />
                    Raise Dispute
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dispute-pid">Project ID</Label>
                    <Input
                      id="dispute-pid"
                      value={disputeForm.pid}
                      onChange={(e) => setDisputeForm({...disputeForm, pid: e.target.value})}
                      placeholder="Enter project ID"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dispute-reason">Reason (Optional)</Label>
                    <Textarea
                      id="dispute-reason"
                      value={disputeForm.reason}
                      onChange={(e) => setDisputeForm({...disputeForm, reason: e.target.value})}
                      placeholder="Enter dispute reason"
                      rows={3}
                    />
                  </div>
                  
                  <Button 
                    onClick={raiseDispute} 
                    disabled={loading}
                    className="w-full"
                    variant="destructive"
                  >
                    {loading ? 'Raising Dispute...' : 'Raise Dispute'}
                  </Button>
                </CardContent>
              </Card>

              {/* Disputed Projects */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Disputed Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.filter(p => p.disputed).length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="mx-auto text-muted-foreground" size={48} />
                      <p className="text-muted-foreground mt-2">No disputed projects</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projects.filter(p => p.disputed).map((project) => (
                        <div key={project.id} className="p-3 border rounded-lg bg-red-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Project #{project.onchain_pid}</h4>
                              <p className="text-sm text-muted-foreground">
                                Disputed on {new Date(project.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="destructive">Disputed</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="refunds" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Process Refund */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowLeftRight size={20} />
                    Process Refund
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="refund-pid">Project ID</Label>
                    <Input
                      id="refund-pid"
                      value={refundForm.pid}
                      onChange={(e) => setRefundForm({...refundForm, pid: e.target.value})}
                      placeholder="Enter project ID"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="refund-mid">Milestone ID</Label>
                    <Input
                      id="refund-mid"
                      value={refundForm.mid}
                      onChange={(e) => setRefundForm({...refundForm, mid: e.target.value})}
                      placeholder="Enter milestone ID"
                    />
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Project must be disputed before refund can be processed.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={processRefund} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Processing Refund...' : 'Process Refund'}
                  </Button>
                </CardContent>
              </Card>

              {/* Refund History */}
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle>Refund History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ArrowLeftRight className="mx-auto text-muted-foreground" size={48} />
                    <p className="text-muted-foreground mt-2">No refunds processed yet</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contract" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings size={20} />
                  Contract Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contractStatus ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Contract Address</Label>
                        <p className="font-mono text-sm bg-secondary p-2 rounded">
                          {contractStatus.contract_address}
                        </p>
                      </div>
                      
                      <div>
                        <Label>Network</Label>
                        <p className="text-sm">{contractStatus.network_name} (Chain ID: {contractStatus.network_chain_id})</p>
                      </div>
                      
                      <div>
                        <Label>Deployment Status</Label>
                        <div className="flex items-center gap-2">
                          {contractStatus.contract_deployed ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <AlertTriangle className="text-red-500" size={20} />
                          )}
                          <span className="text-sm">
                            {contractStatus.contract_deployed ? 'Deployed' : 'Not Deployed'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Admin Wallet</Label>
                        <p className="font-mono text-sm bg-secondary p-2 rounded">
                          {contractStatus.admin_wallet}
                        </p>
                      </div>
                      
                      <div>
                        <Label>Admin Balance</Label>
                        <p className="text-2xl font-bold text-green-600">
                          {contractStatus.admin_balance_eth} AVAX
                        </p>
                      </div>
                      
                      <div>
                        <Label>Contract Code Size</Label>
                        <p className="text-sm">{contractStatus.contract_code_size} bytes</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="mx-auto text-muted-foreground" size={48} />
                    <p className="text-muted-foreground mt-2">Contract status not available</p>
                    <Button onClick={checkContractStatus} className="mt-4">
                      Check Status
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
