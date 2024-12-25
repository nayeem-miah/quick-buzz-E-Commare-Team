import { useQuery } from "@tanstack/react-query";
import React, { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import useAxiosPublic from "../../Hooks/UsePublic";
import 'animate.css';
import "aos/dist/aos.css";
import Aos from "aos";

interface Product {
  adminIsApproved: string;
  _id: number;
  brandName: ReactNode;
  description: ReactNode;
  productImage: string | undefined;
  name: string;
  price: number;
  productTitle: string;
  discount: number;
}

interface CardProps {
  product: Product;
}

const Card: React.FC<CardProps> = ({ product }) => {
  const axiosPublic = useAxiosPublic();

  /* rating data insert */
  const { data: review = [] } = useQuery({
    queryKey: ["review"],
    queryFn: async () => {
      const { data } = await axiosPublic.get(`/review`);
      return data;
    },
  });

  // Filter the reviews for the current product
  const productReviews = review.filter((item: any) => item.productid === product._id);

  // Calculate the average rating
  const averageRating = productReviews.length
    ? productReviews.reduce((sum: number, item: any) => sum + item.rating, 0) / productReviews.length
    : 0;
     
// aos animation
    useEffect(() => {
      Aos.init();
    }, []);
  


  return (
    <div className=""  data-aos="zoom-in" >
      <div className="">
        <Link key={product._id} to={`/product/${product?._id}`}>
          <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
            <img
              src={product?.productImage}
              alt=""
              className="h-48 w-full object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {product?.productTitle}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-orange-600">
                  $ {product?.price}
                </span>
                <span className="text-sm text-gray-500">-{product.discount}%</span>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-sm text-gray-600 ml-1">
                  {averageRating.toFixed(1)} ({productReviews.length} reviews)
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
