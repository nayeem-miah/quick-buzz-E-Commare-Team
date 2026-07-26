import { Filters, ProductItem, ReviewItem, ReviewStats } from './types';

export const normalize = (value: unknown) => String(value || '').toLowerCase().trim();

export const toNumber = (value: number | string | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const levenshtein = (source: string, target: string) => {
  const grid = Array.from({ length: target.length + 1 }, (_, index) => [index]);

  for (let index = 0; index <= source.length; index += 1) {
    grid[0][index] = index;
  }

  for (let row = 1; row <= target.length; row += 1) {
    for (let col = 1; col <= source.length; col += 1) {
      grid[row][col] = target[row - 1] === source[col - 1]
        ? grid[row - 1][col - 1]
        : Math.min(grid[row - 1][col - 1] + 1, grid[row][col - 1] + 1, grid[row - 1][col] + 1);
    }
  }

  return grid[target.length][source.length];
};

export const buildReviewStats = (reviews: ReviewItem[]) => {
  return reviews.reduce((stats: ReviewStats, review) => {
    const id = String(review.productid);
    const current = stats[id] || { average: 0, count: 0, total: 0 };

    current.total += toNumber(review.rating);
    current.count += 1;
    current.average = current.total / current.count;
    stats[id] = current;

    return stats;
  }, {});
};

export const getPageNumbers = (totalPages: number, currentPage: number) => {
  return Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (pageNumber) => totalPages <= 5 || pageNumber === 1 || pageNumber === totalPages || Math.abs(pageNumber - currentPage) <= 1,
  );
};

export const filterAndSortProducts = ({
  products,
  filters,
  catalogMin,
  catalogMax,
  reviewStats,
  searchQuery,
  sortBy,
}: {
  products: ProductItem[];
  filters: Filters;
  catalogMin: number;
  catalogMax: number;
  reviewStats: ReviewStats;
  searchQuery: string;
  sortBy: string;
}) => {
  const min = Math.min(filters.minPrice || catalogMin, filters.maxPrice || catalogMax);
  const max = Math.max(filters.minPrice || catalogMin, filters.maxPrice || catalogMax);

  const filtered = products.filter((product, index) => {
    const productPrice = toNumber(product.price);
    const productDiscount = toNumber(product.discount);
    const productRating = reviewStats[String(product._id)]?.average || 0;
    const productText = normalize([product.productTitle, product.brandName, product.category].join(' '));
    const inStock = index % 5 !== 0;
    const freeDelivery = index % 3 !== 1;

    return (
      (!searchQuery || productText.includes(searchQuery)) &&
      (!filters.brands.length || filters.brands.includes(product.brandName)) &&
      (!filters.categories.length || filters.categories.includes(product.category)) &&
      productPrice >= min &&
      productPrice <= max &&
      (!filters.rating || productRating >= filters.rating) &&
      (!filters.discount || productDiscount >= filters.discount) &&
      (!filters.inStock || inStock) &&
      (!filters.freeDelivery || freeDelivery)
    );
  });

  return filtered.sort((first, second) => {
    const firstPrice = toNumber(first.price);
    const secondPrice = toNumber(second.price);
    const firstRating = reviewStats[String(first._id)]?.average || 0;
    const secondRating = reviewStats[String(second._id)]?.average || 0;
    const firstDiscount = toNumber(first.discount);
    const secondDiscount = toNumber(second.discount);

    if (sortBy === 'Price: Low to High') return firstPrice - secondPrice;
    if (sortBy === 'Price: High to Low') return secondPrice - firstPrice;
    if (sortBy === 'Highest Rating') return secondRating - firstRating;
    if (sortBy === 'Biggest Discount') return secondDiscount - firstDiscount;
    if (sortBy === 'Newest') return String(second._id).localeCompare(String(first._id));

    return secondRating + secondDiscount / 100 - (firstRating + firstDiscount / 100);
  });
};
