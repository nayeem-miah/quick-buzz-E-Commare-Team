import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import BrowseByDestination from '../../Components/Home/BrowseByDestination/BrowseByDestination';
import Faq from '../../Components/Home/Faq/Faq';
import RecentProduct from '../../Components/Home/RecentProducts/RecentProduct';
import useAxiosPublic from '../../Hooks/UsePublic';
import Slider from './Banner/Banner';
import Categories from './Category/Category';
import Uniqe from './Uniqe/Uniqe';

interface Product {
  _id: string;
  productTitle: string;
  brandName: string;
  category: string;
  createAt?: string;
  imageUrl?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

const Home: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = search.trim();
    if (!term) return;

    navigate(`/product?search=${encodeURIComponent(term)}`);
  };

  const handlePopularSearch = (term: string) => {
    setSearch(term);
    navigate(`/product?search=${encodeURIComponent(term)}`);
  };

  // recent product
  const { data: recentData = [], isLoading } = useQuery<Product[], Error>({
    queryKey: ['productData', search],
    queryFn: async () => {
      const res = await axiosPublic.get<ApiResponse<Product[]>>(
        search.trim()
          ? `/products/recent-product?search=${encodeURIComponent(search.trim())}`
          : `/products/recent-product`,
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

        <div className="mx-auto my-12 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[22px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Find what you need
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Search for phones, accessories, laptops and more.
              </p>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto mt-5 flex flex-col gap-2 sm:flex-row sm:items-center"
            >
              <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-4 w-4 text-orange-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search mobile, airpods, laptop..."
                  name="search"
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </label>
              <button
                type="submit"
                className="rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Search
              </button>
            </form>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['AirPods', 'iPhone', 'Mouse', 'Keyboard'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handlePopularSearch(item)}
                  className="rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs text-orange-700 transition hover:bg-orange-100"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
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
