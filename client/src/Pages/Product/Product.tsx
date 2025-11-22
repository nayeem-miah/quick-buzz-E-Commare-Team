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

      {/* Pagination Buttons */}
      <div className="flex justify-center gap-3 mt-10 mb-20">
        <button
          className={`mt-3 px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out 
      border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 
      hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105
      ${isLoading || page <= 1 ? "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none" : ""}`}
          disabled={isLoading || page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <button
          className="mt-3 px-6 py-2 text-white bg-gradient-to-r from-gray-700 to-gray-900 rounded-md border-2 border-transparent"
        >
          Page {page} / {totalPages}
        </button>

        <button
          className={`mt-3 px-6 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out 
      border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 
      hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105
      ${isLoading || page >= totalPages ? "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none" : ""}`}
          disabled={isLoading || page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default Product;
