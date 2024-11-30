import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/UsePublic";
import Categories from "../Home/Category/Category";
import LoadingSpinner from "../../Shared/Loading";
import { Link, useSearchParams } from "react-router-dom";
import BannerDetailsPage from "../../Shared/Heading/BannerDetailsPage";

// প্রোডাক্ট টাইপ ডেফিনিশন
interface Product {
  _id: string;
  brandName: string;
  productImage: string;
  name: string;
  price: number;
  description: string;
  adminIsApproved: string;
}

const Product: React.FC = () => {
  const axiosPublic = useAxiosPublic();
  const [params] = useSearchParams();
  const category = params.get("category") || "all";

  console.log("Current Category from URL:", category);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      const res = await axiosPublic.get(`/products?category=${category}`);
      // console.log("API Response:", res.data);
      return res.data;
    
      
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  

  return (
    <div>
      <BannerDetailsPage
      headingText="Rooms."
      subheadingText="Pleas explore my QuickBuzz all Products and purches your chouse Product"
      ></BannerDetailsPage>
      <div className="mb-10">
        <Categories />
      </div>
      <div className="grid m-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 group  gap-6">
        {products.length > 0 ? (
          products.map(
            (product) =>
              product?.adminIsApproved == "approve" && (
                <Link to={`/product/${product?._id}`}>
                  <div
                    key={product._id}
                    className="overflow-hidden bg-[#26083C] text-white rounded-lg shadow-lg dark:bg-gray-800"
                  >
                    <div className="px-4 py-2">
                      <h1 className="text-xl font-bold uppercase dark:text-white">
                        {product.brandName}
                      </h1>
                      <p className="mt-1 text-sm dark:text-gray-400">
                        {product.description}
                      </p>
                    </div>

                    <img
                      className="object-cover w-full   group-hover:scale-110  h-48 mt-2"
                      src={product.productImage}
                      alt={product.name}
                    />

                    <div className="flex items-center justify-between px-4 py-2 bg-[#F85606]">
                      <h1 className="text-lg font-bold text-white">
                        ${product.price}
                      </h1>
                      <button className="px-2 py-1 text-xs font-semibold text-gray-900 uppercase transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none">
                        Add to cart
                      </button>
                    </div>
                  </div>
                </Link>
              )
          )
        ) : (
          <div className="col-span-full text-center text-gray-500 min-h-[calc(55vh-300px)]">
            <h1 className="text-3xl font-semibold text-black">
              No Rooms Available In This Category!
            </h1>
            <p className="text-sm text-green-700">
              Please Select Other Categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
