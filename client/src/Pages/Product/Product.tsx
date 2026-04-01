import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/UsePublic";
import Categories from "../Home/Category/Category";
import LoadingSpinner from "../../Shared/Loading";
import { useSearchParams } from "react-router-dom";
import BannerDetailsPage from "../../Shared/Heading/BannerDetailsPage";
import Card from "./Card";
import NoData from "../../Shared/NoDataFound/NoData";
import img from "../../../src/assets/Image/service.jpg";
import { Helmet } from "react-helmet-async";

interface Product {
  _id: number;
  brandName: string;
  productImage: string;
  name: string;
  category: string;
  price: number;
  description: string;
  adminIsApproved: string;
  discount: number;
  productTitle: string;
}

const Product: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const [params] = useSearchParams();
  const category = params.get("category") || "all";

  const [page, setPage] = useState(1);
  const [size] = useState(20);

  const [searchText, setSearchText] = useState("");

  /* Fetch products with pagination */
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["products", category, page],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/products?category=${category}&page=${page}&size=${size}`
      );
      return res.data;
    },
    enabled: !!category,
  });

  const products = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;


  const filteredProducts = products.filter((product: Product) =>
    [product.brandName, product.category, product.productTitle]
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
    refetch();
  }, [category, refetch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Helmet>
        <title>quickBuzz | Product Page</title>
      </Helmet>

      <BannerDetailsPage
        imageURL={img}
        headingText="Product."
        subheadingText="Please explore my QuickBuzz all Products and purchase your chosen Product"
      />

      {/* Search Field */}
      <div className="w-full mx-auto p-4 bg-gray-50 border shadow">
        <div className="text-center mb-4">
          <h2 className="text-2xl">Search Products</h2>
          <div className="divider divider-neutral">All Product</div>
          <p className="text-xl">
            Find your desired products by brand, category, or title
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search by brand, category, or title"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="input input-bordered w-full max-w-screen-sm"
          />
          <button onClick={() => setSearchText("")} className="btn btn-warning">
            Clear
          </button>
        </div>
      </div>

      <div className="mb-10">
        <Categories />
      </div>

      {/* Show Products */}
      {filteredProducts.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid max-w-7xl p-2 mx-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts
            .filter((p: Product) => p.adminIsApproved === "approve")
            .map((product: Product) => (
              <Card product={product} key={product._id} />
            ))}
        </div>
      )}

      {/* Pagination Container */}
      {totalPages > 0 && (
        <div className="max-w-7xl mx-auto px-4 flex justify-end items-center gap-3 mt-12 mb-24">
          
          {/* Previous Button */}
          <button
            className={`group px-5 py-2.5 flex items-center gap-2 text-sm font-semibold rounded-xl border transition-all duration-300 
            ${isLoading || page <= 1 
              ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed" 
              : "border-gray-200 text-gray-600 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            }`}
            disabled={isLoading || page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${(!isLoading && page > 1) ? "group-hover:-translate-x-1" : ""}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span className="hidden sm:block">Previous</span>
          </button>

          {/* Page Display */}
          <div className="flex items-center">
            <span className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm">
              Page <span className="text-blue-600">{page}</span> of {totalPages}
            </span>
          </div>

          {/* Next Button */}
          <button
            className={`group px-5 py-2.5 flex items-center gap-2 text-sm font-semibold rounded-xl border transition-all duration-300
            ${isLoading || page >= totalPages 
              ? "border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed" 
              : "border-gray-200 text-gray-600 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            }`}
            disabled={isLoading || page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            <span className="hidden sm:block">Next</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${(!isLoading && page < totalPages) ? "group-hover:translate-x-1" : ""}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

        </div>
      )}

    </div>
  );
};

export default Product;
