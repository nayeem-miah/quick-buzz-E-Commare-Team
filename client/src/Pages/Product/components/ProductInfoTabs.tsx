import { ProductDetailsItem, ProductInfoTab, ProductReview, ProductUser } from '../types';
import ProductReviewsPanel from './ProductReviewsPanel';

interface ProductInfoTabsProps {
  product: ProductDetailsItem;
  activeTab: ProductInfoTab;
  discount: number;
  reviews: ProductReview[];
  isReviewLoading: boolean;
  user: ProductUser;
  isActionDisabled: boolean;
  reviewRating: number;
  reviewText: string;
  isSubmittingReview: boolean;
  eligibility: { isEligible: boolean; reason: string; alreadyReviewed?: boolean };
  onReviewImageChange: (file: File | null) => void;
  onTabChange: (tab: ProductInfoTab) => void;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (value: string) => void;
  onReviewSubmit: () => void;
}

const tabs: ProductInfoTab[] = ['description', 'specifications', 'reviews'];

const ProductInfoTabs = ({
  product,
  activeTab,
  discount,
  reviews,
  isReviewLoading,
  user,
  isActionDisabled,
  reviewRating,
  reviewText,
  isSubmittingReview,
  eligibility,
  onReviewImageChange,
  onTabChange,
  onRatingChange,
  onReviewTextChange,
  onReviewSubmit,
}: ProductInfoTabsProps) => (
  <section className="mt-10 rounded-2xl border border-gray-100 bg-white p-5 sm:p-7">
    <div className="flex gap-2 overflow-x-auto border-b border-gray-100 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${activeTab === tab ? 'bg-orange-400 text-gray-950' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-700'}`}
        >
          {tab}
        </button>
      ))}
    </div>

    <div className="pt-6">
      {activeTab === 'description' && <p className="max-w-4xl text-sm leading-7 text-gray-600">{product.description}</p>}
      {activeTab === 'specifications' && <ProductSpecifications product={product} discount={discount} />}
      {activeTab === 'reviews' && (
        <ProductReviewsPanel
          reviews={reviews}
          isLoading={isReviewLoading}
          user={user}
          isActionDisabled={isActionDisabled}
          rating={reviewRating}
          reviewText={reviewText}
          isSubmitting={isSubmittingReview}
          eligibility={eligibility}
          onReviewImageChange={onReviewImageChange}
          onRatingChange={onRatingChange}
          onReviewTextChange={onReviewTextChange}
          onSubmit={onReviewSubmit}
        />
      )}
    </div>
  </section>
);

const ProductSpecifications = ({ product, discount }: { product: ProductDetailsItem; discount: number }) => (
  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
    <Spec label="Brand" value={product.brandName || 'N/A'} />
    <Spec label="Category" value={product.category || 'N/A'} />
    <Spec label="Discount" value={`${discount}%`} />
    <Spec label="Availability" value="In Stock" />
    <Spec label="Delivery" value="Free Delivery" />
    <Spec label="Seller" value={product.hostName || 'QuickBuzz seller'} />
  </div>
);

const Spec = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
    <p className="mt-1 font-semibold text-gray-900">{value}</p>
  </div>
);

export default ProductInfoTabs;
