'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { StarIcon, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  reviewText: string;
  rating: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface FreelancerReviewsProps {
  freelancerId: string;
}

export function FreelancerReviews({ freelancerId }: FreelancerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?freelancerId=${freelancerId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [freelancerId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet for this freelancer.
      </div>
    );
  }

  const averageRating = reviews.reduce(
    (sum, review) => sum + Number(review.rating), 
    0
  ) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Client Reviews</h2>
        <div className="flex items-center">
          <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
          <span className="font-medium">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{review.user?.name || 'Anonymous'}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(review.createdAt), 'MMMM dd, yyyy')}
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-4 w-4 ${
                      i < Number(review.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill={i < Number(review.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.reviewText}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 