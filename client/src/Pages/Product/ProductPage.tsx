import React from "react";

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  onAddToCart: () => void;
}

const ProductPage: React.FC<ProductCardProps> = ({product}) => {
  return (



    <div
            key={product._id}
            className=" overflow-hidden bg-[#26083C] text-white rounded-lg shadow-lg dark:bg-gray-800"
          >
            <div className="px-4 py-2">
              <h1 className="text-xl font-bold uppercase dark:text-white">
                {product.brandName}
              </h1>
              <p className="mt-1 text-sm  dark:text-gray-400">
                {product.description
                }
              </p>
            </div>

            <img
              className="object-cover w-full h-48 mt-2"
              src={product.productImage}
              alt={product.name}
            />

            <div className="flex items-center justify-between px-4 py-2 bg-[#F85606]">
              <h1 className="text-lg font-bold text-white">${product.price}</h1>
              <button
                className="px-2 py-1 text-xs font-semibold text-gray-900 uppercase transition-colors duration-300 transform bg-white rounded hover:bg-gray-200 focus:bg-gray-400 focus:outline-none"
              >
                Add to cart
              </button>
            </div>
          </div>
  );
};

export default ProductPage;
