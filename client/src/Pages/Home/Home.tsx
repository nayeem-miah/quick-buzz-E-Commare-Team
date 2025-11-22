/* eslint-disable @typescript-eslint/no-unused-expressions */

import React, { useEffect, useState } from "react";
import Faq from "../../Components/Home/Faq/Faq";
import Slider from "./Banner/Banner";
import BrowseByDestination from "../../Components/Home/BrowseByDestination/BrowseByDestination";
import Categories from "./Category/Category";
import RecentProduct from "../../Components/Home/RecentProducts/RecentProduct";
import useAxiosPublic from "../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { Helmet } from "react-helmet-async";
import Uniqe from "./Uniqe/Uniqe";

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
  const [search, setSearch] = useState<string>(""); // Start with an empty search
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const axiosPublic = useAxiosPublic();

  // Debounce search input
  useEffect(() => {
    const handler = debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300);

    handler(search);

    return () => {
      handler.cancel && handler.cancel();
    };
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // recent product
  const { data: recentData = [], isLoading } = useQuery<Product[], Error>({
    queryKey: ["productData", debouncedSearch],
    queryFn: async () => {
      const res = await axiosPublic.get<ApiResponse<Product[]>>(
        debouncedSearch
          ? `/products/recent-product?search=${debouncedSearch}`
          : `/products/recent-product`
      );

      return res.data.data;
    },
    staleTime: 5000,
  });

  console.log(recentData);

  return (
    <div>
      <div className="">
        <Helmet>
          <title>quickBuzz | Home Page </title>
        </Helmet>
        <Slider></Slider>

        {/* search implementation */}
        <div className="">
          <div className="w-full h-auto mx-auto p-4 bg-gray-50 border my-2 shadow">
            {/* Heading Section */}
            <div className="text-center mb-4">
              <h2 className="text-2xl   font-semibold">Search Products</h2>
              <div className="divider divider-neutral">All Product</div>
              <p className="text-xl">
                Find your desired products by brand, category, or title
              </p>
            </div>

            {/* Search Box Section */}
            <form className="flex md:flex-row items-center justify-center gap-2 w-full">
              <input
                type="text"
                required
                placeholder="Search by brand, category, or title"
                name="search"
                value={search}
                onChange={handleSearchChange}
                className="input input-bordered w-full md:w-full max-w-screen-sm"
              />
              <a href="#recentData">
                <button
                  type="button"
                  className="px-5 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                    border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
                >
                  Search
                </button>
              </a>
            </form>
          </div>
        </div>
        <div className="mt-10 space-y-1">
          <h1 className="text-center text-3xl  border-b-2 font-semibold">
            Categories
          </h1>

          <Categories></Categories>
        </div>
        <section className="py-10 lg:p-12 p-2">
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
