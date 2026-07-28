/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductDetailsItem, ProductInfoTab, ProductUser } from '../types';

interface ProductPurchasePanelProps {
  product: ProductDetailsItem;
  price: number;
  originalPrice: number;
  quantity: number;
  total: number;
  averageRating: number;
  reviewCount: number;
  shortDescription: string;
  isActionDisabled: boolean;
  user: ProductUser;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onTabChange: (tab: ProductInfoTab) => void;
}

const ProductPurchasePanel = ({
  product,
  price,
  originalPrice,
  quantity,
  total,
  averageRating,
  reviewCount,
  shortDescription,
  isActionDisabled,
  user,
  onQuantityChange,
  onAddToCart,
  onTabChange,
}: ProductPurchasePanelProps) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-7">
    <div className="flex items-start justify-between gap-4">
      <span className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
        {product.brandName || 'QuickBuzz'}
      </span>
    </div>

    <h1 className="mt-5 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl">
      {product.productTitle}
    </h1>
    <p className="mt-3 text-sm text-gray-500">
      Brand: <span className="font-semibold text-gray-800">{product.brandName || 'Unknown'}</span>
    </p>

    <button type="button" onClick={() => onTabChange('reviews')} className="mt-4 flex items-center gap-2 text-sm text-gray-600 transition hover:text-orange-600">
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 font-semibold text-yellow-700">
        <Star className="h-4 w-4 fill-current" /> {averageRating.toFixed(1)}
      </span>
      <span>{reviewCount} reviews</span>
    </button>

    <div className="mt-6 flex flex-wrap items-baseline gap-3">
      <span className="text-4xl font-bold text-gray-950">${price.toFixed(2)}</span>
      {originalPrice > price && (
        <span className="text-lg font-medium text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
      )}
    </div>

    <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
      <CheckCircle className="h-4 w-4" /> In Stock - {(() => {
        const idStr = String(product?._id || '');
        const seed = idStr ? idStr.charCodeAt(idStr.length - 1) : 0;
        return (product as any).stock || (product as any).quantity || (seed % 40) + 10;
      })()} available
    </p>

    <p className="mt-5 border-t border-gray-100 pt-5 text-sm leading-6 text-gray-600">
      {shortDescription}
    </p>

    <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Quantity</p>
        <div className="mt-2 flex items-center rounded-xl border border-gray-200 bg-white">
          <button type="button" onClick={() => onQuantityChange(Math.max(1, quantity - 1))} className="grid h-10 w-10 place-items-center text-gray-600 hover:bg-gray-50">
            <Minus className="h-4 w-4" />
          </button>
          <span className="grid h-10 min-w-12 place-items-center border-x border-gray-200 text-sm font-bold text-gray-900">{quantity}</span>
          <button type="button" onClick={() => onQuantityChange(quantity + 1)} className="grid h-10 w-10 place-items-center text-gray-600 hover:bg-gray-50">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total</p>
        <p className="mt-2 text-2xl font-bold text-gray-950">${total.toFixed(2)}</p>
      </div>
    </div>

    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {user ? (
        <>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isActionDisabled}
            className="btn min-h-12 border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-400 hover:bg-orange-100 disabled:opacity-50"
          >
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </button>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isActionDisabled}
            className="btn min-h-12 border-0 bg-orange-400 text-gray-950 hover:bg-orange-500 disabled:opacity-50"
          >
            Buy Now
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="btn min-h-12 border-orange-300 bg-orange-50 text-orange-700 hover:border-orange-400 hover:bg-orange-100">
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </Link>
          <Link to="/login" className="btn min-h-12 border-0 bg-orange-400 text-gray-950 hover:bg-orange-500">
            Buy Now
          </Link>
        </>
      )}
    </div>
  </div>
);

export default ProductPurchasePanel;
