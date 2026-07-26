import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAxiosPublic from '../../Hooks/UsePublic';
import LoadingSpinner from '../../Shared/Loading';
import NoData from '../../Shared/NoDataFound/NoData';
import { categories as categoryOptions } from '../Home/Category/CategoryData';
import Card from './Card';
import ActiveFilterChips from './components/ActiveFilterChips';
import CategoryScroller from './components/CategoryScroller';
import FilterPanel from './components/FilterPanel';
import MobileFilterSheet from './components/MobileFilterSheet';
import Pagination from './components/Pagination';
import ResultsHeader from './components/ResultsHeader';
import SearchSection from './components/SearchSection';
import {
  DEFAULT_SEARCHES,
  EMPTY_FILTERS,
  PAGE_SIZE,
  POPULAR_SEARCHES,
  SORT_OPTIONS,
  VISIBLE_CATEGORY_LABELS,
} from './product.constants';
import {
  buildReviewStats,
  filterAndSortProducts,
  getPageNumbers,
  levenshtein,
  normalize,
  toNumber,
} from './product.utils';
import { ActiveFilterChip, Filters, ProductItem } from './types';

const Product = () => {
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const routeCategory = params.get('category') || 'all';

  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_SEARCHES);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS[0]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ...EMPTY_FILTERS,
    categories: routeCategory !== 'all' ? [routeCategory] : [],
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', routeCategory, page],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/products?category=${routeCategory}&page=${page}&size=${PAGE_SIZE}`,
      );
      return res.data;
    },
    enabled: !!routeCategory,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['review'],
    queryFn: async () => {
      const { data: reviewData } = await axiosPublic.get('/review');
      return reviewData.data || [];
    },
  });

  const products: ProductItem[] = useMemo(
    () => (data?.data || []).filter((product: ProductItem) => product.adminIsApproved === 'approve'),
    [data],
  );

  const reviewStats = useMemo(() => buildReviewStats(reviews), [reviews]);
  const totalProducts = data?.meta?.total || data?.meta?.totalProducts || products.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  const currentPage = data?.meta?.page || page;
  const pageNumbers = useMemo(() => getPageNumbers(totalPages, currentPage), [currentPage, totalPages]);

  const prices = products.map((product) => toNumber(product.price)).filter((price) => price > 0);
  const catalogMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const catalogMax = prices.length ? Math.ceil(Math.max(...prices)) : 1000;

  const displayCategories = useMemo(
    () => categoryOptions.filter((category) => VISIBLE_CATEGORY_LABELS.has(category.label)),
    [],
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((product) => product.brandName).filter(Boolean))).sort(),
    [products],
  );

  const productCategories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort(),
    [products],
  );

  const searchableWords = useMemo(() => {
    return Array.from(new Set([
      ...products.flatMap((product) => [product.productTitle, product.brandName, product.category]),
      ...displayCategories.map((category) => category.label),
      ...POPULAR_SEARCHES,
    ].filter(Boolean).map((item) => String(item))));
  }, [displayCategories, products]);

  const typoSuggestion = useMemo(() => {
    if (searchText.trim().length < 3) return '';

    const query = normalize(searchText);
    const best = searchableWords
      .map((word) => ({ word, score: levenshtein(query, normalize(word)) }))
      .sort((first, second) => first.score - second.score)[0];

    return best && best.score > 0 && best.score <= 2 ? best.word : '';
  }, [searchText, searchableWords]);

  const searchQuery = normalize(typoSuggestion || searchText);
  const matchingProducts = products.filter((product) =>
    normalize([product.productTitle, product.brandName, product.category].join(' ')).includes(searchQuery),
  );
  const matchingCategories = displayCategories.filter((category) => normalize(category.label).includes(searchQuery));

  const filteredProducts = useMemo(
    () => filterAndSortProducts({
      products,
      filters,
      catalogMin,
      catalogMax,
      reviewStats,
      searchQuery,
      sortBy,
    }),
    [catalogMin, catalogMax, filters, products, reviewStats, searchQuery, sortBy],
  );

  useEffect(() => {
    const saved = window.localStorage.getItem('quickbuzz-recent-searches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setPage(1);
    setFilters((current) => ({
      ...current,
      categories: routeCategory !== 'all' ? [routeCategory] : [],
    }));
  }, [routeCategory]);

  useEffect(() => {
    if (!products.length) return;

    setFilters((current) => ({
      ...current,
      minPrice: current.minPrice || catalogMin,
      maxPrice: current.maxPrice || catalogMax,
    }));
  }, [catalogMin, catalogMax, products.length]);

  const persistSearch = (value: string) => {
    const term = value.trim();
    if (!term) return;

    const next = [term, ...recentSearches.filter((item) => normalize(item) !== normalize(term))].slice(0, 5);
    setRecentSearches(next);
    window.localStorage.setItem('quickbuzz-recent-searches', JSON.stringify(next));
  };

  const selectCategory = (label: string) => {
    const nextCategory = label === routeCategory ? 'all' : label;
    navigate(`/product${nextCategory === 'all' ? '' : `?category=${encodeURIComponent(nextCategory)}`}`);
  };

  const toggleListFilter = (key: 'brands' | 'categories', value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({ ...EMPTY_FILTERS, minPrice: catalogMin, maxPrice: catalogMax });
    navigate('/product');
  };

  const activeChips: ActiveFilterChip[] = [
    ...filters.brands.map((value) => ({ key: `brand-${value}`, label: value, remove: () => toggleListFilter('brands', value) })),
    ...filters.categories.map((value) => ({ key: `category-${value}`, label: value, remove: () => toggleListFilter('categories', value) })),
    filters.rating ? { key: 'rating', label: `${filters.rating} stars & up`, remove: () => setFilters((current) => ({ ...current, rating: 0 })) } : null,
    filters.discount ? { key: 'discount', label: `${filters.discount}% off & up`, remove: () => setFilters((current) => ({ ...current, discount: 0 })) } : null,
    filters.inStock ? { key: 'stock', label: 'In Stock', remove: () => setFilters((current) => ({ ...current, inStock: false })) } : null,
    filters.freeDelivery ? { key: 'delivery', label: 'Free Delivery', remove: () => setFilters((current) => ({ ...current, freeDelivery: false })) } : null,
  ].filter(Boolean) as ActiveFilterChip[];

  const filterPanel = (
    <FilterPanel
      filters={filters}
      brands={brands}
      productCategories={productCategories}
      catalogMin={catalogMin}
      catalogMax={catalogMax}
      setFilters={setFilters}
      toggleListFilter={toggleListFilter}
    />
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="min-h-screen bg-white pb-16">
      <Helmet>
        <title>QuickBuzz | Products</title>
      </Helmet>

      <SearchSection
        searchText={searchText}
        typoSuggestion={typoSuggestion}
        recentSearches={recentSearches}
        popularSearches={POPULAR_SEARCHES}
        matchingProducts={matchingProducts}
        matchingCategories={matchingCategories}
        onSearchChange={setSearchText}
        onPersistSearch={persistSearch}
      />

      <CategoryScroller
        categories={displayCategories}
        routeCategory={routeCategory}
        selectedCategories={filters.categories}
        onSelectCategory={selectCategory}
      />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div className="min-w-0">
          <ResultsHeader
            currentPage={currentPage}
            totalPages={totalPages}
            totalProducts={totalProducts}
            visibleProducts={filteredProducts.length}
            sortBy={sortBy}
            sortOptions={SORT_OPTIONS}
            onSortChange={setSortBy}
            onOpenFilters={() => setIsFilterOpen(true)}
          />

          <ActiveFilterChips chips={activeChips} onClearAll={clearFilters} />

          {filteredProducts.length === 0 ? (
            <NoData />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <Card
                  key={product._id}
                  product={product}
                  rating={reviewStats[String(product._id)]?.average || 0}
                  reviewCount={reviewStats[String(product._id)]?.count || 0}
                  isFewLeft={index % 5 === 0}
                  hasFreeDelivery={index % 3 !== 1}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalProducts={totalProducts}
            pageNumbers={pageNumbers}
            onPageChange={setPage}
          />
        </div>
      </section>

      <MobileFilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterPanel
          filters={filters}
          brands={brands}
          productCategories={productCategories}
          catalogMin={catalogMin}
          catalogMax={catalogMax}
          mobile
          setFilters={setFilters}
          toggleListFilter={toggleListFilter}
        />
      </MobileFilterSheet>
    </main>
  );
};

export default Product;
