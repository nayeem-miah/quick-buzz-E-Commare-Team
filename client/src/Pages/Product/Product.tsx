import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/UsePublic";
import Categories from "../Home/Category/Category";
import LoadingSpinner from "../../Shared/Loading";
import ProductPage from "./ProductPage";

// Product টাইপ ডেফিনিশন
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  photo: string;
}

interface ProductPage {
  product: Product;
}


// Product কম্পোনেন্ট
const Product: React.FC = () => {
  const axiosPublic = useAxiosPublic();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosPublic.get("/products");
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="mb-10">
        <Categories />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductPage key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Product;
