import { SlidersHorizontal } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';
import { Filters } from '../types';
import { toNumber } from '../product.utils';

interface FilterPanelProps {
  filters: Filters;
  brands: string[];
  productCategories: string[];
  catalogMin: number;
  catalogMax: number;
  mobile?: boolean;
  setFilters: Dispatch<SetStateAction<Filters>>;
  toggleListFilter: (key: 'brands' | 'categories', value: string) => void;
}

const FilterPanel = ({
  filters,
  brands,
  productCategories,
  catalogMin,
  catalogMax,
  mobile = false,
  setFilters,
  toggleListFilter,
}: FilterPanelProps) => {
  return (
    <div className={`${mobile ? '' : 'sticky top-24'} rounded-xl border border-gray-100 bg-white p-5`}>
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <p className="text-sm font-semibold text-gray-950">Filters</p>
          <p className="text-xs text-gray-500">Update results instantly</p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-orange-500" />
      </div>

      <div className="space-y-6 pt-5">
        <CheckboxList
          title="Brand"
          options={brands.slice(0, 8)}
          selected={filters.brands}
          onToggle={(value) => toggleListFilter('brands', value)}
        />

        <CheckboxList
          title="Category"
          options={productCategories.slice(0, 8)}
          selected={filters.categories}
          onToggle={(value) => toggleListFilter('categories', value)}
        />

        <PriceFilter
          catalogMin={catalogMin}
          catalogMax={catalogMax}
          filters={filters}
          setFilters={setFilters}
        />

        <ButtonFilter
          title="Rating"
          values={[4, 3, 2, 1]}
          selected={filters.rating}
          formatLabel={(value) => `${value}★ & up`}
          onSelect={(value) => setFilters((current) => ({ ...current, rating: current.rating === value ? 0 : value }))}
        />

        <ButtonFilter
          title="Discount"
          values={[10, 20, 30, 40]}
          selected={filters.discount}
          formatLabel={(value) => `${value}%+`}
          onSelect={(value) => setFilters((current) => ({ ...current, discount: current.discount === value ? 0 : value }))}
        />

        <section>
          <h3 className="text-sm font-semibold text-gray-900">Availability</h3>
          <div className="mt-3 space-y-2">
            <label className="flex items-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(event) => setFilters((current) => ({ ...current, inStock: event.target.checked }))}
                className="checkbox checkbox-warning checkbox-sm rounded"
              />
              In Stock
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={filters.freeDelivery}
                onChange={(event) => setFilters((current) => ({ ...current, freeDelivery: event.target.checked }))}
                className="checkbox checkbox-warning checkbox-sm rounded"
              />
              Free Delivery
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

const CheckboxList = ({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) => (
  <section>
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    <div className="mt-3 space-y-2">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => onToggle(option)}
            className="checkbox checkbox-warning checkbox-sm rounded"
          />
          {option}
        </label>
      ))}
    </div>
  </section>
);

const PriceFilter = ({
  filters,
  catalogMin,
  catalogMax,
  setFilters,
}: {
  filters: Filters;
  catalogMin: number;
  catalogMax: number;
  setFilters: Dispatch<SetStateAction<Filters>>;
}) => (
  <section>
    <h3 className="text-sm font-semibold text-gray-900">Price Range</h3>
    <div className="mt-3 grid grid-cols-2 gap-2">
      <input
        type="number"
        value={filters.minPrice || catalogMin}
        onChange={(event) => setFilters((current) => ({ ...current, minPrice: toNumber(event.target.value) }))}
        className="input input-bordered input-sm w-full rounded-xl"
      />
      <input
        type="number"
        value={filters.maxPrice || catalogMax}
        onChange={(event) => setFilters((current) => ({ ...current, maxPrice: toNumber(event.target.value, catalogMax) }))}
        className="input input-bordered input-sm w-full rounded-xl"
      />
    </div>
    <div className="mt-4 space-y-3">
      <input
        type="range"
        min={catalogMin}
        max={catalogMax}
        value={filters.minPrice || catalogMin}
        onChange={(event) => setFilters((current) => ({ ...current, minPrice: Math.min(toNumber(event.target.value), current.maxPrice || catalogMax) }))}
        className="range range-warning range-xs"
      />
      <input
        type="range"
        min={catalogMin}
        max={catalogMax}
        value={filters.maxPrice || catalogMax}
        onChange={(event) => setFilters((current) => ({ ...current, maxPrice: Math.max(toNumber(event.target.value), current.minPrice || catalogMin) }))}
        className="range range-warning range-xs"
      />
    </div>
  </section>
);

const ButtonFilter = ({
  title,
  values,
  selected,
  formatLabel,
  onSelect,
}: {
  title: string;
  values: number[];
  selected: number;
  formatLabel: (value: number) => string;
  onSelect: (value: number) => void;
}) => (
  <section>
    <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
    <div className="mt-3 grid grid-cols-2 gap-2">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={`rounded-xl border px-3 py-2 text-sm transition ${selected === value ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600 hover:border-orange-200'}`}
        >
          {formatLabel(value)}
        </button>
      ))}
    </div>
  </section>
);

export default FilterPanel;
