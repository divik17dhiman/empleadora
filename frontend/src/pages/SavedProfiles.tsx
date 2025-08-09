
import React from 'react';
import { Link } from 'react-router-dom';
import { useSavedProfiles } from '@/context/SavedProfilesContext';
import { Button } from '@/components/ui/button';
import { Bookmark, MessageSquare, Star, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const SavedProfiles = () => {
  const { savedProfiles, removeProfile } = useSavedProfiles();

  const handleRemove = (id: string, name: string) => {
    removeProfile(id);
    toast({
      title: 'Profile removed',
      description: `${name} has been removed from your saved profiles.`
    });
  };

  return (
    <div className="pt-32 pb-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Saved Profiles</h1>
          <p className="text-muted-foreground">
            View and manage your saved freelancer profiles
          </p>
        </div>
        
        {savedProfiles.length === 0 ? (
          <div className="max-w-md mx-auto card-elevated rounded-xl border p-8 text-center subtle-shadow">
            <Bookmark size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-medium mb-2">No saved profiles yet</h2>
            <p className="text-muted-foreground mb-6">
              When you find talented freelancers you like, save them here for easy access.
            </p>
            <Button asChild>
              <Link to="/freelancers">Browse Freelancers</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProfiles.map((profile) => (
              <div key={profile.id} className="card-elevated rounded-xl border overflow-hidden subtle-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <Link to={`/profile/${profile.id}`}>
                      <img 
                        src={profile.avatar} 
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover subtle-shadow" 
                      />
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${profile.id}`} className="hover:text-primary transition-colors">
                        <h3 className="font-medium text-lg truncate">{profile.name}</h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mb-3">{profile.title}</p>
                      
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="rounded-full h-8 px-3 gap-1">
                          <MessageSquare size={14} />
                          Message
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="rounded-full h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemove(profile.id, profile.name)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedProfiles;
