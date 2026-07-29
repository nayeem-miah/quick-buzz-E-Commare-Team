import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import useAuth from '../../Hooks/UseAuth';
import useFetchSingleUser from '../../Hooks/UseFindSingleUser';
import useAxiosPublic from '../../Hooks/UsePublic';
import LoadingSpinner from '../../Shared/Loading';
import ProductBreadcrumb from './components/ProductBreadcrumb';
import ProductGallery from './components/ProductGallery';
import ProductInfoTabs from './components/ProductInfoTabs';
import ProductPurchasePanel from './components/ProductPurchasePanel';
import RelatedProducts from './components/RelatedProducts';
import {
  getAverageRating,
  getProductImages,
  getShortDescription,
} from './productDetails.utils';
import { toNumber } from './product.utils';
import { ProductDetailsItem, ProductInfoTab, ProductItem, ProductReview } from './types';

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { singleUser } = useFetchSingleUser(user?.email as string);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ProductInfoTab>('description');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { data: product, isLoading, isError, error } = useQuery<ProductDetailsItem>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  const { data: reviews = [], isLoading: isReviewLoading } = useQuery<ProductReview[]>({
    queryKey: ['product-reviews', id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/review/${id}`);
      return data.data || [];
    },
    enabled: !!id,
  });

  const { data: relatedData = [] } = useQuery<ProductItem[]>({
    queryKey: ['related-products', product?.category, product?._id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/products?category=${encodeURIComponent(product?.category || '')}&page=1&size=5`);
      return data.data || [];
    },
    enabled: !!product?.category,
  });

  const relatedProducts = useMemo(
    () => relatedData
      .filter((item) => item.adminIsApproved === 'approve' && String(item._id) !== String(product?._id))
      .slice(0, 5),
    [relatedData, product?._id],
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError || !product) return <div className="p-8 text-center text-red-500">Error: {error?.message || 'Product not found'}</div>;

  const price = toNumber(product.price);
  const discount = toNumber(product.discount);
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : 0;
  const total = price * quantity;
  const images = getProductImages(product.productImage, product.productImages);
  const averageRating = getAverageRating(reviews);
  const shortDescription = getShortDescription(product.description);
  const isActionDisabled = singleUser?.role === 'admin' || singleUser?.role === 'Host';

  const handleAddToCart = () => {
    if (!user?.email) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    axiosPublic
      .post('/cart', {
        email: user?.email,
        product_id: product._id,
        quantity,
      })
      .then((res) => {
        if (res.data.statusCode === 201) {
          toast.success('Product added to cart.');
          queryClient.invalidateQueries({ queryKey: ['allsave'] });
        } else {
          toast.error('Failed to add product.');
        }
      })
      .catch(() => toast.error('Server error occurred.'));
  };

  const handleReviewSubmit = async () => {
    if (!reviewRating || !reviewText.trim()) {
      toast.error('Please add a rating and review.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await axiosPublic.post('/review', {
        rating: reviewRating,
        productid: id,
        review: reviewText,
        name: user?.displayName,
        photo: user?.photoURL,
        email: user?.email,
        timestamp: new Date().toLocaleString(),
      });

      if (res.data.statusCode === 201) {
        toast.success('Thank you for your feedback!');
        setReviewRating(0);
        setReviewText('');
        queryClient.invalidateQueries({ queryKey: ['product-reviews', id] });
      } else {
        toast.error('Please try again.');
      }
    } catch {
      toast.error('Server error occurred.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pb-16">
      <Helmet>
        <title>QuickBuzz | {product.productTitle}</title>
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ProductBreadcrumb category={product.category} title={product.productTitle} />

        <section className="grid gap-8 lg:grid-cols-[1fr_0.92fr] lg:items-start">
          <ProductGallery
            title={product.productTitle}
            images={images}
            mainImage={images[activeImageIndex] || product.productImage}
            discount={discount}
            activeImageIndex={activeImageIndex}
            onImageChange={setActiveImageIndex}
          />

          <ProductPurchasePanel
            product={product}
            price={price}
            originalPrice={originalPrice}
            quantity={quantity}
            total={total}
            averageRating={averageRating}
            reviewCount={reviews.length}
            shortDescription={shortDescription}
            isActionDisabled={isActionDisabled}
            user={user}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onTabChange={setActiveTab}
          />
        </section>

        <ProductInfoTabs
          product={product}
          activeTab={activeTab}
          discount={discount}
          reviews={reviews}
          isReviewLoading={isReviewLoading}
          user={user}
          isActionDisabled={isActionDisabled}
          reviewRating={reviewRating}
          reviewText={reviewText}
          isSubmittingReview={isSubmittingReview}
          onTabChange={setActiveTab}
          onRatingChange={setReviewRating}
          onReviewTextChange={setReviewText}
          onReviewSubmit={handleReviewSubmit}
        />

        <RelatedProducts category={product.category} products={relatedProducts} />
      </div>
    </main>
  );
};

export default ProductDetailsPage;
