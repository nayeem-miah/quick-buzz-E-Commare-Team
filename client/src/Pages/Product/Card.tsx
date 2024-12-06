import React, { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Product {
  adminIsApproved: string;
  _id: number;
  brandName: ReactNode;
  description: ReactNode;
  productImage: string | undefined;
  name: string;
  price: number;
  productTitle:string
  discount: number;
}

interface CardProps {
  product: Product;
}

const Card: React.FC<CardProps> = ({ product }) => {
  const handleSaveClick = () => {
    console.log("hellp world");
  };


  return (
    <div className="">
      <div className="">
      <Link key={product._id} to={`/product/${product?._id}`}>
      <div className=" bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition">
      <img
        src={product?.productImage}
        alt= ''
        className="h-48 w-full object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{product?.productTitle}</h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-orange-600">$ {product?.price}</span>
          <span className="text-sm text-gray-500">-{product.discount}%</span>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-sm text-gray-600 ml-1">(Rating) </span>
          <span className="text-xs text-gray-500 ml-2"> </span>
        </div>
      </div>
    </div>
      </Link>
    </div>
    </div>
  );
};

export default Card;
