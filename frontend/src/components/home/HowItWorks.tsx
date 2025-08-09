
import React from 'react';
import { FileText, DollarSign, Briefcase, CheckSquare } from 'lucide-react';
import { useUserMode } from '@/context/UserModeContext';
import { cn } from '@/lib/utils';

export function HowItWorks() {
  const { mode } = useUserMode();
  
  const clientSteps = [
    {
      icon: FileText,
      title: 'Post Your Project',
      description: 'Describe your project in detail so freelancers understand what you need.'
    },
    {
      icon: Briefcase,
      title: 'Browse & Select',
      description: 'Review profiles, portfolios, and proposals to find the perfect freelancer.'
    },
    {
      icon: DollarSign,
      title: 'Fund Escrow',
      description: 'Place your payment in secure escrow to protect both parties.'
    },
    {
      icon: CheckSquare,
      title: 'Review & Release',
      description: 'Approve the work when satisfied, and the funds are released to the freelancer.'
    }
  ];
  
  const freelancerSteps = [
    {
      icon: Briefcase,
      title: 'Find Projects',
      description: 'Browse and apply to projects that match your skills and interests.'
    },
    {
      icon: FileText,
      title: 'Submit Proposal',
      description: "Show clients why you're the best fit for their project with a compelling proposal."
    },
    {
      icon: DollarSign,
      title: 'Start Working',
      description: 'Begin work once the client funds the secure escrow account.'
    },
    {
      icon: CheckSquare,
      title: 'Get Paid',
      description: 'Receive your payment as soon as the client approves your completed work.'
    }
  ];
  
  const steps = mode === 'client' ? clientSteps : freelancerSteps;
  
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            {mode === 'client' 
              ? 'Four simple steps to get your project done by talented freelancers.' 
              : 'Four simple steps to start earning by doing what you do best.'}
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={cn(
                  "text-center animate-fade-in card-elevated p-6 rounded-xl border border-border",
                  "transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg",
                  {"animation-delay-200": index === 1},
                  {"animation-delay-400": index === 2},
                  {"animation-delay-600": index === 3}
                )}
              >
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse"></div>
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 card-elevated rounded-full subtle-shadow border border-border">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <div className="absolute top-0 right-0 flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-medium">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
