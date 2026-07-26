import { Filters } from './types';

export const PAGE_SIZE = 20;

export const DEFAULT_SEARCHES = ['wireless mouse', 'fast charger', 'gaming keyboard'];
export const POPULAR_SEARCHES = ['AirPods', 'Laptop stand', 'USB-C cable', 'Pendrive'];

export const SORT_OPTIONS = [
  'Popularity',
  'Price: Low to High',
  'Price: High to Low',
  'Newest',
  'Highest Rating',
  'Biggest Discount',
];

export const VISIBLE_CATEGORY_LABELS = new Set([
  'Mobile',
  'Mouse',
  'Keyboard',
  'AirPods',
  'Laptop',
  'Charger',
  'Cable',
  'Earphones',
  'PenDrive',
  'Stand',
  'Speaker',
  'Light',
]);

export const EMPTY_FILTERS: Filters = {
  brands: [],
  categories: [],
  minPrice: 0,
  maxPrice: 0,
  rating: 0,
  discount: 0,
  inStock: false,
  freeDelivery: false,
};
