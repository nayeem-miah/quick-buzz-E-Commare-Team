import { ProductReview } from './types';
import { toNumber } from './product.utils';

export const getAverageRating = (reviews: ProductReview[]) => {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + toNumber(review.rating), 0) / reviews.length;
};

export const getShortDescription = (description = '', maxLength = 180) => {
  return description.length > maxLength ? `${description.slice(0, maxLength)}...` : description;
};

export const getProductImages = (image?: string, imagesArray?: string[]) => {
  if (Array.isArray(imagesArray) && imagesArray.length > 0) {
    return imagesArray.filter(Boolean);
  }
  return image ? [image] : [];
};
