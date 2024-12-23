/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import BannerDetailsPage from "../../Shared/Heading/BannerDetailsPage";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/UseAuth";
import Afk from "./Afk";
import Review from "./Review";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

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

  const [showQuickView, setShowQuickView] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const {
    productImage,
    description,
    brandName,
    productTitle,
    _id,
    hostName,
    price,
    discount,
    hostEmail,
    hostPhoto,
  } = product;
  const priceFloat = parseFloat(price);
  // console.log(product);

  // Handle Add to Cart button
  const HandleButton = () => {
    try {
      const newData = {
        _id,
        productImage,
        description,
        brandName,
        productTitle,
        hostName,
        price: priceFloat,
        discount,
        email: user?.email,
        displayName: user?.displayName,
        hostEmail: hostEmail,
      };

      axiosPublic
        .post("/allsave", newData)
        .then((res) => {
          if (res.status === 201) {
            toast.success(
              "Your data is saved. Please explore my listing page."
            );
          } else {
            toast.error("Failed to save data.");
          }
        })
        .catch((error) => {
          console.error("Error posting data:", error);
          toast.error("Server error occurred.");
        });
    } catch (err) {
      console.error("Error occurred:", err);
      toast.error("Error in handling button.");
    }
  };

  return (
    <div>
      <BannerDetailsPage
        imageURL={productImage}
        headingText="Explore this Product."
        subheadingText="Please explore my QuickBuzz all Product and purchase your choice Product"
      />

      {/* Product Details Page */}
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full bg-gradient-to-r from-purple-100 to-blue-100 lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-12 row-gap-8 lg:grid-cols-2">
          {/* Product Info Section */}
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <div className="flex mb-8 gap-20 text-xl">
                <div className="avatar">
                  <div className="w-12 rounded-full ml-4">
                    <img src={hostPhoto} alt="user" />
                  </div>
                </div>
                <h2 className="mt-3 text-2xl font-mono">
                  HostName:
                  <span className="text-green-400"> {hostName}</span>
                </h2>
              </div>
              <h3 className="text-3xl font-semibold text-gray-800 tracking-wide">
                {brandName}
              </h3>
              <p className="text-base mt-2 text-gray-600 md:text-lg">
                {productTitle}
              </p>
              <p className="text-2xl mt-4 font-bold text-orange-600">
                $ {price}
              </p>
            </div>
            <div>
              {user ? (
                <button
                  onClick={HandleButton}
                  className="mt-6 px-12 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Add To Cart
                </button>
              ) : (
                <Link to={'/login'}><button className="mt-6 px-12 py-3 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                Add To Cart
              </button></Link>
              )}
            </div>
          </div>

          {/* Product Image Section */}
          <div className="flex justify-center items-center relative group">
            <img
              className="object-cover lg:ml-40 ml-8 h-64 sm:h-96 group-hover:scale-105 transform transition duration-300 shadow-2xl rounded-lg"
              src={productImage}
              alt="Product"
            />
            {/* Quick View Button */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => setShowQuickView(true)}
                className="text-white text-xl font-semibold py-2 px-6 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg hover:bg-yellow-500 focus:outline-none"
              >
                Quick View
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Section (Additional Info) */}
        <div className="mt-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-semibold text-gray-800">
              Product Details
            </h3>
            <p className="mt-4 text-lg text-gray-700">{description}</p>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Quick View
            </h2>
            <img
              className="w-full h-48 object-cover mb-4"
              src={productImage}
              alt="Product"
            />
            <p className="text-lg text-gray-700">{description}</p>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowQuickView(false)}
                className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Reviews and Ratings */}
      <Review id={id} />
      <div>
        <Afk />
      </div>
    </div>
  );
};

export default ProductPage;
