import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/UsePublic";
import Categories from "../Home/Category/Category";
import LoadingSpinner from "../../Shared/Loading";
import { useSearchParams } from "react-router-dom";
import BannerDetailsPage from "../../Shared/Heading/BannerDetailsPage";
import Card from "./Card";
import NoData from "../../Shared/NoDataFound/NoData";
import img from "../../../src/assets/Image/service.jpg";
import { FaSearch } from "react-icons/fa";

interface Product {
  [x: string]: any;
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

  const [searchText, setSearchText] = useState(""); // Search Text
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Filtered Products

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

  React.useEffect(() => {
    refetch();
  }, [category, refetch]);

  React.useEffect(() => {
    // Filter Logic
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
      <BannerDetailsPage
        imageURL={img}
        headingText="Product."
        subheadingText="Please explore my QuickBuzz all Products and purchase your chosen Product"
      />

      {/* Search Field */}
      <div className="w-full h-auto mx-auto p-4 bg-red-400">
        {/* Heading Section */}
        <div className="text-center mb-4">
          <h2 className="text-2xl   font-semibold">
            
            Search Products
          </h2>
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

             <button className="button" > </button>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map(
            (product) =>
              product.adminIsApproved === "approve" && (
                <Card product={product} key={product._id} />
              )
          )}
        </div>
      )}
    </div>
  );
};

export default Product;
