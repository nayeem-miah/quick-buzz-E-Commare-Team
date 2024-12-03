import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/UsePublic";
import Categories from "../Home/Category/Category";
import LoadingSpinner from "../../Shared/Loading";
import { useSearchParams } from "react-router-dom";
import BannerDetailsPage from "../../Shared/Heading/BannerDetailsPage";
import Card from "./Card";

interface Product {
  _id: number;
  brandName: string;
  productImage: string;
  name: string;
  price: number;
  description: string;
  adminIsApproved: string;
}
interface CardProps {
  product: Product; // প্রপস টাইপ ডিফাইন করা হয়েছে
}

const Product: React.FC<CardProps> = () => {
  const axiosPublic = useAxiosPublic();
  const [params] = useSearchParams();
  const category = params.get("category") || "all";

  // console.log("Current Category from URL:", category);

  const {
    data: products = [],
    isLoading,
    refetch,
  } = useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products?category=${category}`);
      // console.log("Category API Response:", res.data);
      return res.data;
    },
    enabled: !!category,
  });

  React.useEffect(() => {
    refetch(); //
  }, [category, refetch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <BannerDetailsPage
        headingText="Product."
        subheadingText="Please explore my QuickBuzz all Products and purchase your chosen Product"
      />
      <div className="mb-10">
        <Categories />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(
          (product) =>
            // <Link to={`/product/${product.id}`} >
            product.adminIsApproved === "approve" && (
              <Card product={product} key={product._id} />
            )
          // </Link>
        )}
      </div>
    </div>
  );
};

export default Product;
