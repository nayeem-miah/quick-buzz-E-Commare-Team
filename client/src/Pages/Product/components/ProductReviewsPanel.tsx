import { Link } from 'react-router-dom';
import LoadingSpinner from '../../../Shared/Loading';
import { ProductReview, ProductUser } from '../types';
import { toNumber } from '../product.utils';
import StarRating from './StarRating';
import { Star } from 'lucide-react';

interface ProductReviewsPanelProps {
  reviews: ProductReview[];
  isLoading: boolean;
  user: ProductUser;
  isActionDisabled: boolean;
  rating: number;
  reviewText: string;
  isSubmitting: boolean;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (value: string) => void;
  onSubmit: () => void;
}

const ProductReviewsPanel = ({
  reviews,
  isLoading,
  user,
  isActionDisabled,
  rating,
  reviewText,
  isSubmitting,
  onRatingChange,
  onReviewTextChange,
  onSubmit,
}: ProductReviewsPanelProps) => (
  <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
    <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-950">Customer Reviews</h2>
        <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-700">{reviews.length} Reviews</span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : reviews.length ? (
        <div className="space-y-5">
          {reviews.map((item) => (
            <article key={item._id || item.id || `${item.name}-${item.timestamp}`} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <div className="flex gap-4">
                <img src={item.photo || '/avatar.png'} alt={item.name || 'Customer'} className="h-11 w-11 rounded-full bg-gray-100 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-950">{item.name || 'QuickBuzz Customer'}</h3>
                    <span className="text-xs text-gray-400">{item.timestamp}</span>
                  </div>
                  <StarRating rating={toNumber(item.rating)} />
                  <p className="mt-3 text-sm leading-6 text-gray-600">{item.review}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-gray-50 p-8 text-center">
          <Star className="mx-auto h-8 w-8 text-gray-300" />
          <h3 className="mt-3 font-semibold text-gray-950">No reviews yet</h3>
          <p className="mt-1 text-sm text-gray-500">Be the first to share your experience.</p>
        </div>
      )}
    </div>

    <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-gray-950">Write a Review</h2>
      <p className="mt-1 text-sm text-gray-500">Help other shoppers choose confidently.</p>

      <div className="mt-5 flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onRatingChange(star)} className="transition hover:scale-110" aria-label={`Rate ${star} stars`}>
            <Star className={`h-8 w-8 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
          </button>
        ))}
      </div>

      <textarea
        value={reviewText}
        onChange={(event) => onReviewTextChange(event.target.value)}
        placeholder="Share your thoughts about this product..."
        className="mt-5 h-32 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
      />

      {user ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || isActionDisabled}
          className="btn mt-4 w-full border-0 bg-orange-400 text-gray-950 hover:bg-orange-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      ) : (
        <Link to="/login" className="btn mt-4 w-full border-0 bg-orange-400 text-gray-950 hover:bg-orange-500">
          Login to Review
        </Link>
      )}
    </div>
  </section>
);

export default ProductReviewsPanel;
