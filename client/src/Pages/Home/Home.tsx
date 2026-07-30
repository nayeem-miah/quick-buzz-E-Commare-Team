import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import BrowseByDestination from '../../Components/Home/BrowseByDestination/BrowseByDestination';
import Faq from '../../Components/Home/Faq/Faq';
import RecentProduct from '../../Components/Home/RecentProducts/RecentProduct';
import useAxiosPublic from '../../Hooks/UsePublic';
import Slider from './Banner/Banner';
import Categories from './Category/Category';
import Uniqe from './Uniqe/Uniqe';
import { ProductItem } from '../Product/types';

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

const Home: React.FC = () => {
  const axiosPublic = useAxiosPublic();

  // recent product
  const { data: recentData = [], isLoading } = useQuery<ProductItem[], Error>({
    queryKey: ['productData'],
    queryFn: async () => {
      const res = await axiosPublic.get<ApiResponse<ProductItem[]>>(
        `/products/recent-product`,
      );

      return res.data.data;
    },
    staleTime: 5000,
  });

  return (
    <div>
      <div className="">
        <Helmet>
          <title>quickBuzz | Home Page </title>
        </Helmet>
        <Slider></Slider>

        <div className="mx-auto mt-10 px-2 sm:px-4 lg:px-12">
          <div className="rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Categories
              </h3>
            </div>

            <Categories />
          </div>
        </div>
        <section className="py-16 px-2 sm:px-4 lg:px-12">
          {/* {recent added product} */}
          <RecentProduct recentData={recentData} isLoading={isLoading} />
        </section>
        <BrowseByDestination />
        {/* user any question answer */}
        <Uniqe></Uniqe>
        <Faq></Faq>
      </div>
    </div>
  );
};
export default Home;
