/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useParams } from "react-router-dom";
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
  } = product;
  const priceFloat = parseFloat(price);

  /* data post  */
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

      {/* Datails page for Afk  */}
    

      {/* product details  */}
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full bg-red-300 lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
        <div className="grid gap-12 row-gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-6">
              <h3 className="text-2xl font-semibold">{brandName}</h3>
              <p className="text-base mt-1 text-gray-700 md:text-lg">
                {productTitle}
              </p>
              <p className="text-lg mt-2 font-bold text-orange-600">
                $ {price}
              </p>
            </div>
            <div>
              <button
                onClick={HandleButton}
                className="mt-2 px-10 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md transition-all duration-500 ease-in-out border-2 border-transparent hover:bg-indigo-600 hover:border-indigo-400 hover:shadow-[0_0_15px_3px_rgba(99,102,241,0.7)] hover:scale-105"
              >
                Add To Cart
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <img
              className="object-cover lg:ml-40 ml-8 h-56 group-hover:scale-125 shadow-xl sm:h-96 max-w-full"
              src={productImage}
              alt=""
            />
          </div>
        </div>
      </div>

      {/*user review rating start */}
      <Review id={id} />
      <div>
        <Afk />
      </div>
    </div>
  );
};

export default ProductPage;
