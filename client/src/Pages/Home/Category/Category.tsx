import React from 'react';
import CategoryBox from './CategoryBox';
import { categories } from './CategoryData';

const Categories: React.FC = () => {
  return (
    <div className="flex gap-5 overflow-x-auto pb-1">
      {categories.map((item) => (
        <CategoryBox key={item.label} label={item.label} icon={item.icon} />
      ))}
    </div>
  );
};

export default Categories;
