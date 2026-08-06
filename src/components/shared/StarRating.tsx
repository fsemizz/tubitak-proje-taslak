import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const StarRating: React.FC<StarRatingProps> = ({ stars, maxStars = 3, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} transition-all duration-300 ${
              isFilled
                ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        );
      })}
    </div>
  );
};
