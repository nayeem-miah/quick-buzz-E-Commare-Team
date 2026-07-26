import { Truck } from 'lucide-react';

interface ProductGalleryProps {
  title: string;
  images: string[];
  mainImage: string;
  discount: number;
  activeImageIndex: number;
  onImageChange: (index: number) => void;
}

const ProductGallery = ({
  title,
  images,
  mainImage,
  discount,
  activeImageIndex,
  onImageChange,
}: ProductGalleryProps) => (
  <div>
    <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm">
          <Truck className="h-3.5 w-3.5" /> Free Delivery
        </span>
        {discount > 0 && (
          <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">-{discount}%</span>
        )}
      </div>
      <div className="flex h-[320px] items-center justify-center overflow-hidden sm:h-[460px]">
        <img
          src={mainImage}
          alt={title}
          className="max-h-full max-w-full object-contain transition duration-500 hover:scale-105"
        />
      </div>
    </div>

    <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
      {images.map((image, index) => (
        <button
          key={`${image}-${index}`}
          type="button"
          onClick={() => onImageChange(index)}
          className={`h-20 rounded-xl border bg-gray-50 p-2 transition hover:border-orange-200 ${activeImageIndex === index ? 'border-orange-400' : 'border-gray-100'}`}
        >
          <img src={image} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-contain" />
        </button>
      ))}
    </div>
  </div>
);

export default ProductGallery;
