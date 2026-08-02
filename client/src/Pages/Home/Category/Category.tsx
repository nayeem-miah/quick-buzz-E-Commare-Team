import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useAxiosPublic from '../../../Hooks/UsePublic';
import CategoryBox from './CategoryBox';

interface CategoryType {
  _id: string;
  name: string;
  icon: string;
}

const Categories: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosPublic.get('/categories');
      return res.data;
    },
  });

  const categories = categoryData?.data || [];

  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 2);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 2);
    }
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateArrows);
    }
    window.addEventListener('resize', updateArrows);
    return () => {
      if (el) {
        el.removeEventListener('scroll', updateArrows);
      }
      window.removeEventListener('resize', updateArrows);
    };
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative w-full group/nav">
      {/* Left Arrow with fade gradient */}
      {showLeftArrow && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex w-16 items-center bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none rounded-l-xl">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all duration-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:scale-105 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Categories Scroll Area */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-1 no-scrollbar scroll-smooth"
      >
        {categories.map((item: CategoryType) => (
          <CategoryBox key={item._id} label={item.name} icon={item.icon} />
        ))}
      </div>

      {/* Right Arrow with fade gradient */}
      {showRightArrow && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex w-16 items-center justify-end bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none rounded-r-xl">
          <button
            type="button"
            onClick={() => scroll('right')}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all duration-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 hover:scale-105 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Categories;
