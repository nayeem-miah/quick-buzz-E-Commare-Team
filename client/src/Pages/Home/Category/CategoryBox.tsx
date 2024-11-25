import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';

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
  
    console.log("Generated URL:", url); 
    navigate(url);  // নতুন ক্যাটাগরি নির্বাচন হলে URL আপডেট হবে
  };
  

  return (
    <div
      onClick={handleClick}
      className={`flex 
        flex-col 
        items-center 
        justify-center 
        gap-2
        w-24 
        h-24
        rounded-full
        p-3
        border-b-2
        hover:text-neutral-800
        transition
        cursor-pointer ${
          category === label && 'border-b-neutral-800 text-neutral-800'
        }`}
    >
      <Icon size={26} />
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
};

export default CategoryBox;
