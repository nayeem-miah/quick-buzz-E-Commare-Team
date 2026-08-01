/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle2, Filter, Image, Star, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../../Shared/Loading';
import { toNumber } from '../product.utils';
import { ProductReview, ProductUser } from '../types';
import StarRating from './StarRating';
import CustomDropdown from '../../../Shared/Dropdown/CustomDropdown';

interface ProductReviewsPanelProps {
  reviews: ProductReview[];
  isLoading: boolean;
  user: ProductUser;
  isActionDisabled: boolean;
  rating: number;
  reviewText: string;
  isSubmitting: boolean;
  eligibility: { isEligible: boolean; reason: string; alreadyReviewed?: boolean };
  onReviewImageChange: (file: File | null) => void;
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
  eligibility,
  onReviewImageChange,
  onRatingChange,
  onReviewTextChange,
  onSubmit,
}: ProductReviewsPanelProps) => {
  // Sort and Filter States
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [filterStar, setFilterStar] = useState<number | 'all'>('all');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 1. Calculate Breakdown Metrics
  const totalReviews = reviews.length;
  const starCounts = [0, 0, 0, 0, 0, 0]; // 1 to 5 index
  reviews.forEach((r) => {
    const rate = Math.round(toNumber(r.rating));
    if (rate >= 1 && rate <= 5) {
      starCounts[rate]++;
    }
  });

  const averageRating = useMemo(() => {
    if (totalReviews === 0) return '0.0';
    const sum = reviews.reduce((acc, r) => acc + toNumber(r.rating), 0);
    return (sum / totalReviews).toFixed(1);
  }, [reviews, totalReviews]);

  // 2. Sort and Filter Logic
  const processedReviews = useMemo(() => {
    let result = [...reviews];

    // Filter
    if (filterStar !== 'all') {
      result = result.filter((r) => Math.round(toNumber(r.rating)) === filterStar);
    }

    // Sort
    if (sortBy === 'recent') {
      result.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.timestamp || 0).getTime();
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.timestamp || 0).getTime();
        return timeB - timeA;
      });
    } else if (sortBy === 'highest') {
      result.sort((a, b) => toNumber(b.rating) - toNumber(a.rating));
    } else if (sortBy === 'lowest') {
      result.sort((a, b) => toNumber(a.rating) - toNumber(b.rating));
    }

    return result;
  }, [reviews, sortBy, filterStar]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onReviewImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    onReviewImageChange(null);
    setImagePreview(null);
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
      {/* Reviews List & Stats Column */}
      <div className="space-y-6">
        {/* Breakdown Stats */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-950 mb-6">Review Summary</h2>
          <div className="grid gap-6 md:grid-cols-[1fr_2fr] items-center">
            {/* Average score */}
            <div className="text-center p-6 bg-orange-50/50 rounded-2xl border border-orange-100/50 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-orange-600">{averageRating}</span>
              <div className="mt-2 flex justify-center text-orange-400">
                <StarRating rating={Math.round(toNumber(averageRating))} />
              </div>
              <span className="mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {totalReviews} Customer Reviews
              </span>
            </div>

            {/* Breakdown bars */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = starCounts[star];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <button
                    key={star}
                    onClick={() => setFilterStar(filterStar === star ? 'all' : star)}
                    className={`flex items-center gap-4 w-full group text-left px-2 py-1 rounded-xl transition ${filterStar === star ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
                  >
                    <span className="text-sm font-bold text-gray-700 w-3">{star}</span>
                    <Star className="h-4 w-4 text-orange-400 fill-orange-400 shrink-0" />
                    <div className="h-2.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full transition-all duration-500 group-hover:bg-orange-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List & Controls */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-950 flex items-center gap-2">
              Reviews List
              <span className="text-xs bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full font-bold">
                {processedReviews.length}
              </span>
            </h2>

            <div className="flex items-center gap-3">
              {/* Star Filter Dropdown */}
              <CustomDropdown
                value={filterStar.toString()}
                onChange={(val) => setFilterStar(val === 'all' ? 'all' : parseInt(val))}
                options={[
                  { value: 'all', label: 'All Stars' },
                  { value: '5', label: '5 Stars' },
                  { value: '4', label: '4 Stars' },
                  { value: '3', label: '3 Stars' },
                  { value: '2', label: '2 Stars' },
                  { value: '1', label: '1 Star' },
                ]}
                className="w-36 md:w-40"
                buttonClassName="w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm font-semibold rounded-xl px-3.5 py-1.5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all"
                leftIcon={<Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />}
              />

              {/* Sorting */}
              <CustomDropdown
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                options={[
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'highest', label: 'Highest Rating' },
                  { value: 'lowest', label: 'Lowest Rating' },
                ]}
                className="w-36 md:w-44"
                buttonClassName="w-full bg-gray-50 border border-gray-100 text-gray-700 text-sm font-semibold rounded-xl px-3.5 py-1.5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all"
              />
            </div>
          </div>

          {/* Render List */}
          {isLoading ? (
            <LoadingSpinner />
          ) : processedReviews.length ? (
            <div className="space-y-6">
              {processedReviews.map((item) => (
                <article
                  key={item._id || item.id || `${item.name}-${item.timestamp}`}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={item.photo || '/avatar.png'}
                      alt={item.name || 'Customer'}
                      className="h-12 w-12 rounded-full bg-gray-100 object-cover border-2 border-white shadow-sm shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-950 text-base">{item.name || 'QuickBuzz Customer'}</h3>
                          {item.isVerifiedPurchase && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="h-3 w-3 fill-emerald-100 text-emerald-700 shrink-0" />
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{item.timestamp}</span>
                      </div>
                      <div className="mt-1 flex text-orange-400">
                        <StarRating rating={toNumber(item.rating)} />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600 font-medium">{item.review || item.comment}</p>

                      {/* Review image display */}
                      {item.imageUrl && (
                        <div className="mt-4">
                          <img
                            src={item.imageUrl}
                            alt="Review media"
                            className="max-h-40 max-w-full rounded-2xl object-cover border border-gray-100 shadow-sm transition hover:scale-105 duration-300"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-gray-50/50 border border-gray-100 p-8 text-center">
              <Star className="mx-auto h-8 w-8 text-gray-300" />
              <h3 className="mt-3 font-semibold text-gray-950">No matching reviews</h3>
              <p className="mt-1 text-sm text-gray-500">Try changing your filters or sorting options.</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Form Column */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-950">Write a Review</h2>
        <p className="mt-1 text-sm text-gray-500">Help other shoppers choose confidently.</p>

        {/* State check for review input eligibility */}
        {!user ? (
          <div className="mt-6 text-center py-6 bg-orange-50/20 border border-orange-100 rounded-2xl">
            <p className="text-sm font-semibold text-gray-600 mb-4">Please log in to submit a review.</p>
            <Link to="/login" className="btn border-0 bg-orange-400 text-gray-950 hover:bg-orange-500 w-2/3 mx-auto flex items-center justify-center">
              Login to Review
            </Link>
          </div>
        ) : !eligibility.isEligible ? (
          <div className="mt-6 p-5 text-center bg-gray-50 border border-gray-200 rounded-2xl">
            <p className="text-sm font-bold text-gray-700 leading-relaxed">
              {eligibility.reason || 'You are not eligible to review this product.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {/* Rating Stars Input */}
            <div>
              <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Rating</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => onRatingChange(star)}
                    className="transition hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating >= star ? 'fill-orange-400 text-orange-400' : 'text-gray-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment input */}
            <div>
              <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Feedback</span>
              <textarea
                value={reviewText}
                onChange={(event) => onReviewTextChange(event.target.value)}
                placeholder="Share your thoughts about this product..."
                className="h-32 w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </div>

            {/* Optional image input */}
            <div>
              <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Add Photo (Optional)</span>

              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-orange-300 bg-gray-50 hover:bg-orange-50/10 p-5 rounded-2xl cursor-pointer transition">
                  <Image className="h-6 w-6 text-gray-400" />
                  <span className="mt-2 text-xs font-semibold text-gray-500">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm max-w-xs">
                  <img src={imagePreview} alt="Upload preview" className="max-h-32 w-full object-cover" />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-sm transition"
                    title="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting || isActionDisabled || !rating || !reviewText.trim()}
              className="btn w-full border-0 bg-orange-400 text-gray-950 hover:bg-orange-500 disabled:opacity-50 font-bold"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviewsPanel;
