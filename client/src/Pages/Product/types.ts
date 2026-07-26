import { ElementType } from 'react';

export interface ProductItem {
  _id: number | string;
  brandName: string;
  productImage: string;
  name?: string;
  category: string;
  price: number | string;
  description: string;
  adminIsApproved: string;
  discount: number | string;
  productTitle: string;
}

export interface ProductDetailsItem extends ProductItem {
  hostName?: string;
  hostEmail?: string;
  tags?: string;
}

export interface ReviewItem {
  productid: number | string;
  rating: number;
}

export interface ProductReview {
  _id?: string;
  id?: string;
  productid?: number | string;
  rating: number;
  review: string;
  name?: string;
  photo?: string;
  timestamp?: string;
}

export type ProductInfoTab = 'description' | 'specifications' | 'reviews';

export type ProductUser = {
  displayName?: string | null;
  photoURL?: string | null;
  email?: string | null;
} | null | undefined;

export type Filters = {
  brands: string[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
  rating: number;
  discount: number;
  inStock: boolean;
  freeDelivery: boolean;
};

export type ReviewStat = {
  average: number;
  count: number;
  total: number;
};

export type ReviewStats = Record<string, ReviewStat>;

export type ActiveFilterChip = {
  key: string;
  label: string;
  remove: () => void;
};

export type CategoryOption = {
  label: string;
  icon: ElementType;
};
