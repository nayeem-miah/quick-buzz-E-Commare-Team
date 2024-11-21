import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';

interface CategoryBoxProps {
  label: string;
  icon: React.ElementType; // যেকোনো React কম্পোনেন্ট টাইপের জন্য
}

const CategoryBox: React.FC<CategoryBoxProps> = ({ label, icon: Icon }) => {
  const [params] = useSearchParams();
  const category = params.get('category');
  const navigate = useNavigate();

  const handleClick = () => {
    const currentQuery = { category: label };

    const url = queryString.stringifyUrl({
      url: '/',
      query: currentQuery,
    });

    navigate(url);
    console.log(label);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex 
        flex-col 
        items-center 
        justify-center 
        gap-2
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
