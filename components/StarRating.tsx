'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  size?: number;
}

export function StarRating({
  rating,
  onRatingChange,
  maxRating = 5,
  size = 24,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;
        const filled = (hoverRating !== null ? hoverRating : rating) >= starValue;

        return (
          <button
            key={index}
            type="button"
            className={`focus:outline-none transition-colors p-1 ${
              filled ? 'text-yellow-400' : 'text-gray-300'
            }`}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => onRatingChange(starValue)}
          >
            <Star
              size={size}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
} 