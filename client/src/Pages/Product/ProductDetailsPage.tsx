import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAxiosPublic from "../../Hooks/UsePublic";
import { useQuery } from "@tanstack/react-query";
import BannerDetailsPage from "../../Shared/Heading/BannerDetailsPage";
import toast from "react-hot-toast";
import useAuth from "../../Hooks/UseAuth";
import Review from "./Review";
import LoadingSpinner from "../../Shared/Loading";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import { FaShoppingCart, FaRegStar } from "react-icons/fa";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const { singleUser } = useFetchSingleUser(user?.email as string);
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/products/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
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
  const oldPrice = discount ? (priceFloat / (1 - parseFloat(discount) / 100)).toFixed(2) : null;
  const total = (priceFloat * quantity).toFixed(2);
  
  const shortTitle = productTitle?.length > 55 ? productTitle.slice(0, 55) + "..." : productTitle;
  const shortDesc = description?.length > 150 ? description.slice(0, 150) + "..." : description;

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
        .post("/wishlist", newData)
        .then((res) => {
          if (res.data.statusCode === 201) {
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
    <div className="bg-white min-h-screen pb-20">
      <BannerDetailsPage
        imageURL={productImage}
        headingText="Explore this Product"
        subheadingText="Discover premium products at QuickBuzz and enhance your lifestyle."
      />

      <div className="px-4 py-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Column: Image Container */}
          <div className="w-full lg:w-1/2 p-10 border border-gray-200 rounded-xl bg-[#fafafa] flex justify-center items-center h-[500px]">
            <img 
              src={productImage} 
              alt={productTitle} 
              className="max-w-full max-h-full object-contain" 
            />
          </div>

          {/* Right Column: Details Container */}
          <div className="w-full lg:w-1/2 p-8 border border-gray-200 rounded-xl bg-white flex flex-col">
            
            {/* Category/Badge */}
            {brandName && (
              <div className="flex">
                <span className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 bg-white shadow-sm">
                  {brandName}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="mt-6 text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
              {shortTitle}
            </h1>

            {/* Brand Info */}
            <div className="mt-4 text-sm text-gray-500">
              Brand: <span className="text-blue-500 font-medium">{brandName || "Unknown"}</span>
            </div>

            {/* Reviews (Placeholder design) */}
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <div className="flex text-gray-300 mr-2 text-lg">
                <FaRegStar /><FaRegStar /><FaRegStar /><FaRegStar /><FaRegStar />
              </div>
              <span>0.0 (0 reviews)</span>
            </div>

            {/* Price section */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-[2.5rem] font-bold text-blue-600 tracking-tight">${price}</span>
              {oldPrice && <span className="text-lg text-gray-400 font-medium line-through">${oldPrice}</span>}
            </div>

            {/* Stock status */}
            <div className="mt-3 text-[#22c55e] text-sm font-medium">
              In Stock (100 available)
            </div>
            
            <p className="mt-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-6">
              {shortDesc}
            </p>

            {/* Quantity & Actions area pushed to bottom */}
            <div className="mt-auto pt-6">
              {/* Quantity */}
              <div className="mb-8 flex flex-wrap items-center gap-6 text-sm lg:text-base">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Quantity :</span>
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-l-md transition"
                    >-</button>
                    <span className="px-5 py-1.5 border-l border-r border-gray-300 text-gray-800 font-medium">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)} 
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-r-md transition"
                    >+</button>
                  </div>
                </div>
                <div className="text-gray-700 font-medium">
                  Total : <span className="text-blue-600 font-bold ml-1">${total}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                {user ? (
                  <>
                    <button 
                      onClick={HandleButton} 
                      disabled={singleUser?.role === "admin" || singleUser?.role === "Host"} 
                      className="flex-1 py-3.5 border border-blue-600 text-blue-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button 
                      onClick={HandleButton} 
                      disabled={singleUser?.role === "admin" || singleUser?.role === "Host"} 
                      className="flex-1 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      Buy Now
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="w-full flex gap-4">
                    <button className="flex-1 py-3.5 border border-blue-600 text-blue-600 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button className="flex-1 py-3.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                      Buy Now
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Reviews and Ratings */}
      <Review id={id as string} />
    </div>
  );
};

export default ProductPage;
