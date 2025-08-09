import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Shield, CreditCard, Clock, CheckCircle, AlertTriangle, Smartphone, Users, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EscrowPaymentCardProps {
  projectId: string;
  projectTitle: string;
  amount: number;
  currency?: string;
  status: 'pending' | 'funded' | 'in_progress' | 'dispute' | 'completed' | 'released';
  freelancerName: string;
  clientName: string;
  milestones?: {
    id: string;
    title: string;
    amount: number;
    status: 'pending' | 'completed' | 'approved';
    dueDate: string;
  }[];
  onAction?: (action: string, data?: unknown) => void;
  userRole: 'client' | 'freelancer' | 'admin';
}

const statusConfig = {
  pending: { 
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200', 
    icon: Clock, 
    message: 'Waiting for client to fund escrow' 
  },
  funded: { 
    color: 'text-blue-600 bg-blue-50 border-blue-200', 
    icon: Shield, 
    message: 'Funds secured in escrow. Work can begin!' 
  },
  in_progress: { 
    color: 'text-purple-600 bg-purple-50 border-purple-200', 
    icon: Users, 
    message: 'Project in progress. Funds held safely' 
  },
  dispute: { 
    color: 'text-red-600 bg-red-50 border-red-200', 
    icon: AlertTriangle, 
    message: 'Dispute in progress. Funds frozen pending resolution' 
  },
  completed: { 
    color: 'text-green-600 bg-green-50 border-green-200', 
    icon: CheckCircle, 
    message: 'Work completed. Awaiting final approval' 
  },
  released: { 
    color: 'text-green-700 bg-green-100 border-green-300', 
    icon: CheckCircle, 
    message: 'Payment released successfully!' 
  }
};

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: '🏧', popular: true },
  { id: 'razorpay', name: 'Razorpay', icon: '💳', popular: true },
  { id: 'paytm', name: 'Paytm', icon: '📱', popular: true },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', popular: false },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', popular: false }
];

export function EscrowPaymentCard({
  projectId,
  projectTitle,
  amount,
  currency = '₹',
  status,
  freelancerName,
  clientName,
  milestones = [],
  onAction,
  userRole
}: EscrowPaymentCardProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  
  const config = statusConfig[status];
  const IconComponent = config.icon;
  
  const totalCompleted = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = milestones.length > 0 ? (totalCompleted / milestones.length) * 100 : 0;

  const handleAction = (action: string, data?: unknown) => {
    onAction?.(action, data);
  };

  const canFundEscrow = userRole === 'client' && status === 'pending';
  const canReleasePayment = userRole === 'client' && status === 'completed';
  const canSubmitWork = userRole === 'freelancer' && status === 'in_progress';
  const canRaiseDispute = (userRole === 'client' || userRole === 'freelancer') && 
                          (status === 'in_progress' || status === 'completed');

  return (
    <Card className={cn("card-elevated border-2", config.color)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full", config.color)}>
              <IconComponent size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Escrow Payment</h3>
              <p className="text-sm text-muted-foreground font-normal">{projectTitle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{currency}{amount.toLocaleString()}</div>
            <Badge variant="outline" className={config.color}>
              {status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Message */}
        <div className={cn("p-4 rounded-lg border", config.color)}>
          <div className="flex items-center gap-2 mb-2">
            <IconComponent size={16} />
            <span className="font-medium">Status Update</span>
          </div>
          <p className="text-sm">{config.message}</p>
        </div>

        {/* Project Participants */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-sm text-muted-foreground">Client</div>
            <div className="font-medium">{clientName}</div>
          </div>
          <div className="text-center p-3 bg-secondary rounded-lg">
            <div className="text-sm text-muted-foreground">Freelancer</div>
            <div className="font-medium">{freelancerName}</div>
          </div>
        </div>

        {/* Milestones Progress */}
        {milestones.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Project Progress</span>
              <span className="text-sm text-muted-foreground">
                {totalCompleted}/{milestones.length} milestones completed
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            
            <div className="space-y-2">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle 
                      size={16} 
                      className={milestone.status === 'completed' ? 'text-green-500' : 'text-gray-400'} 
                    />
                    <span className="text-sm">{milestone.title}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {currency}{milestone.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Features */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-blue-600" size={16} />
            <span className="font-medium text-blue-800">Escrow Protection</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <Lock size={12} />
              <span>Funds held securely until work completion</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={12} />
              <span>Professional dispute resolution</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone size={12} />
              <span>UPI & Indian payment methods</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={12} />
              <span>Refund protection for both parties</span>
            </div>
          </div>
        </div>

        {/* Payment Methods (for funding) */}
        {canFundEscrow && (
          <div className="space-y-4">
            <div className="font-medium">Choose Payment Method</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border text-left transition-colors",
                    selectedPaymentMethod === method.id 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="text-lg">{method.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{method.name}</div>
                    {method.popular && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {canFundEscrow && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" size="lg">
                  <CreditCard className="mr-2" size={16} />
                  Fund Escrow ({currency}{amount.toLocaleString()})
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Fund Escrow Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    You're about to deposit {currency}{amount.toLocaleString()} into the secure escrow account for "{projectTitle}". 
                    These funds will be held safely and released to {freelancerName} only after you approve the completed work.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction('fund_escrow', { paymentMethod: selectedPaymentMethod })}>
                    Proceed to Payment
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {canReleasePayment && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="flex-1" size="lg">
                  <CheckCircle className="mr-2" size={16} />
                  Release Payment
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Release Escrow Payment</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you satisfied with the work completed by {freelancerName}? 
                    This will release {currency}{amount.toLocaleString()} from escrow to the freelancer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Review Again</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleAction('release_payment')}>
                    Yes, Release Payment
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {canSubmitWork && (
            <Button className="flex-1" size="lg" onClick={() => handleAction('submit_work')}>
              <CheckCircle className="mr-2" size={16} />
              Submit Completed Work
            </Button>
          )}

          {canRaiseDispute && (
            <Button variant="outline" onClick={() => handleAction('raise_dispute')}>
              <AlertTriangle className="mr-2" size={16} />
              Raise Dispute
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground text-center">
          Need help? Contact our support team for assistance with escrow payments.
          <br />
          All transactions are secured and monitored for your protection.
        </div>
      </CardContent>
    </Card>
  );
}
