import React from 'react';
import { Star, Calendar, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
  projectTitle: string;
  helpful: number;
  verified: boolean;
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating ? 'text-amber-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="card-elevated">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
            <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-sm">{review.reviewerName}</h4>
              {review.verified && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-muted-foreground">
                {review.rating.toFixed(1)} out of 5
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              Project: {review.projectTitle}
            </p>
            
            <p className="text-sm mb-3">{review.comment}</p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(review.date).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-1">
                <ThumbsUp size={12} />
                {review.helpful} found helpful
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
