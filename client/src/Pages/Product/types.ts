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

export interface ReviewItem {
  productid: number | string;
  rating: number;
}

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
