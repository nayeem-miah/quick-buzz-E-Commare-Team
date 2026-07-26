import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'lg';
}

const StarRating = ({ rating, size = 'sm' }: StarRatingProps) => {
  const iconSize = size === 'lg' ? 'h-8 w-8' : 'h-4 w-4';

  return (
    <div className="mt-1 flex text-yellow-400">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`${iconSize} ${index < rating ? 'fill-current' : 'text-gray-200'}`} />
      ))}
    </div>
  );
};

export default StarRating;
