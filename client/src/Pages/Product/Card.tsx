import { ShoppingCart, Star } from 'lucide-react';
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  adminIsApproved: string;
  _id: number | string;
  brandName: ReactNode;
  description: ReactNode;
  productImage: string | undefined;
  price: number | string;
  productTitle: string;
  discount: number | string;
}

interface CardProps {
  product: Product;
  rating?: number;
  reviewCount?: number;
  isFewLeft?: boolean;
  hasFreeDelivery?: boolean;
}

const toNumber = (value: number | string | undefined, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const Card: React.FC<CardProps> = ({
  product,
  rating = 0,
  reviewCount = 0,
  isFewLeft = false,
  hasFreeDelivery = false,
}) => {
  const price = toNumber(product.price);
  const discount = toNumber(product.discount);
  const originalPrice = discount > 0 ? price / (1 - discount / 100) : 0;

  return (
    <article className="group relative flex h-[330px] w-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition duration-200 hover:border-orange-200 hover:shadow-sm sm:h-[350px]">
      {discount > 0 && (
        <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">
          -{discount}%
        </span>
      )}

      <Link to={`/product/${product._id}`} className="block">
        <div className="h-36 overflow-hidden bg-gray-50 sm:h-40">
          <img
            src={product.productImage}
            alt={product.productTitle}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-2 flex h-6 flex-wrap gap-1.5 overflow-hidden">
          {hasFreeDelivery && (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
              Free Delivery
            </span>
          )}
          {isFewLeft && (
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700">
              Only few left
            </span>
          )}
        </div>

        <Link to={`/product/${product._id}`} className="block">
          <h3 className="line-clamp-2 h-10 text-sm font-semibold leading-5 text-gray-900 transition hover:text-orange-600">
            {product.productTitle}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-700">
            <Star className="h-3.5 w-3.5 fill-current" /> {rating.toFixed(1)}
          </span>
          <span className="truncate text-xs text-gray-500">
            ({reviewCount} reviews)
          </span>
        </div>

        <div className="mt-2 flex min-h-7 flex-wrap items-baseline gap-2">
          <span className="text-base font-bold text-gray-950 sm:text-lg">
            ${price.toFixed(2)}
          </span>
          {originalPrice > price && (
            <span className="text-xs font-medium text-gray-400 line-through sm:text-sm">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <Link
          to={`/product/${product._id}`}
          className="btn btn-sm mt-auto min-h-9 w-full border-0 bg-orange-400 text-gray-950 shadow-none transition hover:bg-orange-500 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Link>
      </div>
    </article>
  );
};

export default Card;
