import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../../Hooks/UsePublic';
import CategoryBox from './CategoryBox';

interface CategoryType {
  _id: string;
  name: string;
  icon: string;
}

const Categories: React.FC = () => {
  const axiosPublic = useAxiosPublic();

  const { data: categoryData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosPublic.get('/categories');
      return res.data;
    },
  });

  const categories = categoryData?.data || [];

  return (
    <div className="flex gap-5 overflow-x-auto pb-1">
      {categories.map((item: CategoryType) => (
        <CategoryBox key={item._id} label={item.name} icon={item.icon} />
      ))}
    </div>
  );
};

export default Categories;
