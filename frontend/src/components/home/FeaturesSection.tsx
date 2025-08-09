
import React from 'react';
import { Shield, Users, Award, Handshake, Smartphone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Shield,
    title: 'Secure Escrow System',
    description: 'Payments are held safely in escrow until work is completed and approved, protecting both clients and freelancers with local payment options.'
  },
  {
    icon: Smartphone,
    title: 'UPI & Razorpay Integration',
    description: 'Easy payments through familiar Indian payment methods including UPI, Paytm, and local banking options.'
  },
  {
    icon: Award,
    title: 'KYC Verified Profiles',
    description: 'All freelancers complete identity verification with Aadhaar and skill validation to ensure authenticity.'
  },
  {
    icon: MapPin,
    title: 'Local & Remote Work',
    description: 'Find talent in your city for on-site work or collaborate remotely with professionals across India.'
  },
  {
    icon: Users,
    title: 'AI-Powered Matching',
    description: 'Smart recommendations connect clients with the most suitable freelancers based on skills, location, and budget.'
  },
  {
    icon: Handshake,
    title: 'Dispute Resolution',
    description: 'Professional mediation in Hindi and English ensures fair resolution of any project disputes or issues.'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-secondary relative">
      <div className="absolute left-0 top-1/4 w-1/3 aspect-square rounded-full bg-primary/5 blur-3xl -z-0"></div>
      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Empleadora</h2>
          <p className="text-muted-foreground">
            Our platform combines security, quality, and simplicity to create the best freelancing experience possible.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "card-elevated rounded-xl p-6 subtle-shadow border border-border",
                "transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg",
                "animate-fade-in",
                {"animation-delay-200": index % 3 === 1},
                {"animation-delay-400": index % 3 === 2}
              )}
            >
              <div className="inline-flex items-center justify-center p-3 mb-4 rounded-lg bg-primary/10 text-primary">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
