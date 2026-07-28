import { CategoryOption } from '../types';

interface CategoryScrollerProps {
  categories: CategoryOption[];
  routeCategory: string;
  selectedCategories: string[];
  onSelectCategory: (label: string) => void;
}

const CategoryScroller = ({
  categories,
  routeCategory,
  selectedCategories,
  onSelectCategory,
}: CategoryScrollerProps) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map(({ label, icon }) => {
          const active = routeCategory === label || selectedCategories.includes(label);

          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelectCategory(label)}
              className={`group flex min-w-24 flex-col items-center gap-2 rounded-xl border px-4 py-3 transition hover:border-orange-200 ${active ? 'border-orange-300 bg-orange-50 text-orange-700' : 'border-gray-200 bg-white text-gray-600'}`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gray-50 transition group-hover:bg-orange-50">
                <img src={icon} alt={label} className="w-6 h-6 opacity-80" />
              </span>
              <span className="text-xs font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryScroller;
