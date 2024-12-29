/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/UsePublic";
import Categories from "../Home/Category/Category";
import LoadingSpinner from "../../Shared/Loading";
import { useLoaderData, useSearchParams } from "react-router-dom";
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

interface LoaderData {
  count: number;
}
 


const Product: React.FC = () => {
  const { count } = useLoaderData() as LoaderData; // টাইপ স্পেসিফাই করা হয়েছে
   console.log(count);

   const itemPerPage = 10 ;
   const numberOfPage = Math.ceil(count / itemPerPage)

    
   const pages = [...Array(numberOfPage).keys()];








  const axiosPublic = useAxiosPublic();
  const [params] = useSearchParams();
  const category = params.get("category") || "all";

  const [searchText, setSearchText] = useState(""); // Search Text
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Filtered Products

  /* product Category data get */
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products?category=${category}`);
      return res.data;
    },
    enabled: !!category,
  });

  // Refetch when category changes
  useEffect(() => {
    refetch();
  }, [category, refetch]);

  // Filter products based on search text
  useEffect(() => {
    const result = products.filter(
      (product) =>
        product.brandName.toLowerCase().includes(searchText.toLowerCase()) ||
        product.category.toLowerCase().includes(searchText.toLowerCase()) ||
        product.productTitle.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(result);
  }, [searchText, products]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Helmet>
        <title>quickBuzz | Product Page </title>
      </Helmet>
      <BannerDetailsPage
        imageURL={img}
        headingText="Product."
        subheadingText="Please explore my QuickBuzz all Products and purchase your chosen Product"
      />

      {/* Search Field */}
      <div className="w-full h-auto mx-auto p-4 bg-gray-50 border shadow" >
        {/* Heading Section */}
        <div className="text-center mb-4">
          <h2 className="text-2xl">Search Products</h2>
          <div className="divider divider-neutral">All Product</div>
          <p className="text-xl">
            Find your desired products by brand, category, or title
          </p>
        </div>

        {/* Search Box Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="w-full max-w-screen-sm">
            <input
              type="text"
              placeholder="Search by brand, category, or title"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <button className="button"> </button>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <Categories />
      </div>

      {/* Display Products */}
      {filteredProducts.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid max-w-7xl p-2 mx-auto grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) =>
            product.adminIsApproved === "approve" ? (
              <Card product={product} key={product._id} />
            ) : null
          )}

       
        </div>
        
      )}
          <div className="text-center text-2xl">
            { pages?.map(page => <button className="btn ml-2 bg-black text-white">
           
              {page}
            </button>)}
           </div>
      </div>
  );
};

export default Product;
