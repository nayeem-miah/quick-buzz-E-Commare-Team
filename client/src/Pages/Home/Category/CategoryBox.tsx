import queryString from 'query-string';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface CategoryBoxProps {
  label: string;
  icon: React.ElementType;
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ label, icon: Icon }) => {
  const [params] = useSearchParams();
  const category = params.get('category');
  const navigate = useNavigate();

  const handleClick = () => {
    const currentQuery = { category: label };

    const url = queryString.stringifyUrl({
      url: '/product',
      query: currentQuery,
    });

    // console.log("Generated URL:", url);
    navigate(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex min-w-[92px] flex-col items-center justify-center gap-2 rounded-xl border px-2.5 py-3.5 text-center transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 ${
        category === label
          ? 'border-orange-300 bg-orange-50 text-orange-600 shadow-sm'
          : 'border-slate-200 bg-white text-slate-700'
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
        <Icon size={18} />
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default CategoryBox;
