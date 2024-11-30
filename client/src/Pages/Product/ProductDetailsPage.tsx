import React from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import BannerDetailsPage from "../../Shared/Heading/BannerDetailsPage";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const axiosPublic = useAxiosPublic();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/product/${id}`);
      return data;
    },
    enabled: !!id,
  });
  //

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;
  console.log(product);

  const { productImage, description, brandName, productTitle, _id } = product;

  return (
    <div>
      <BannerDetailsPage
        headingText="Explore this Product."
        subheadingText="Pleas explore my QuickBuzz all Product and purches your chouse Product"
      ></BannerDetailsPage>

      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full group lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-12 row-gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none">
                {productTitle}
                <br className="hidden md:block" />
              </h2>
              <h3 className="text-2xl font-semibold ">{brandName}</h3>
              <p className="text-base mt-1 text-gray-700 md:text-lg">
                {description}
              </p>
            </div>
            <div className="flex flex-col md:flex-row  md:gap-20 lg:items-end justify-end">
              <Link
              to={`/checkout/${_id}`}
                className="mt-2 px-14 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
               border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
              >
                Buy Now
              </Link>
              <button
                className="mt-2 px-10 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out
                    border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
              >
               Add To Cart
              </button>
            </div>
          </div>
          <div className="">
            <img
              className="object-cover lg:ml-40 ml-8 h-56 group-hover:scale-125  shadow-xl rounded-3xl sm:h-96"
              src={productImage}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
