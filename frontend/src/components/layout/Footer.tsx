
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary pt-16 pb-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link to="/" className="text-foreground font-semibold text-xl tracking-tight inline-block mb-6">
              Emlpea<span className="text-primary">dora</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              A secure platform connecting clients with top freelancers, protected by escrow payments and professional moderation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-6">For Clients</h3>
            <ul className="space-y-3">
              <li><Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">Post a Project</Link></li>
              <li><Link to="/freelancers" className="text-muted-foreground hover:text-primary transition-colors">Find Freelancers</Link></li>
              <li><Link to="/contests" className="text-muted-foreground hover:text-primary transition-colors">Start a Contest</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">How to Hire</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-6">For Freelancers</h3>
            <ul className="space-y-3">
              <li><Link to="/projects" className="text-muted-foreground hover:text-primary transition-colors">Find Work</Link></li>
              <li><Link to="/contests" className="text-muted-foreground hover:text-primary transition-colors">Contests</Link></li>
              <li><Link to="/saved-profiles" className="text-muted-foreground hover:text-primary transition-colors">Saved Profiles</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-foreground mb-6">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Escrow System</Link></li>
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Moderation</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Empleadora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
