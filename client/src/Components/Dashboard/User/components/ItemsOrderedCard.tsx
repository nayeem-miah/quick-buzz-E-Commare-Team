import React from "react";
import { FiPackage } from "react-icons/fi";
import { OrderItem } from "../../../../types/order";

interface ItemsOrderedCardProps {
  items: OrderItem[];
}

export const ItemsOrderedCard: React.FC<ItemsOrderedCardProps> = ({ items }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-950 flex items-center gap-2 pb-2 border-b border-gray-50">
        <FiPackage className="text-gray-400" /> Items Ordered
      </h2>
      <div className="divide-y divide-gray-100">
        {items.map((item: OrderItem) => (
          <div key={item._id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-4">
              <img
                src={item.productImage}
                alt={item.productTitle}
                className="w-16 h-16 object-cover rounded-xl border border-gray-50 flex-shrink-0"
              />
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-gray-950 line-clamp-1">{item.productTitle}</h4>
                <p className="text-xs text-gray-400">Brand: <span className="font-semibold text-gray-700">{item.brandName || "Unknown"}</span></p>
                <p className="text-xs text-gray-400">Qty: <span className="font-bold text-gray-800">{item.quantity}</span></p>
              </div>
            </div>
            <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center gap-2">
              <span className="text-sm font-bold text-orange-500">
                ৳{((item.price || 0) * (1 - (item.discount || 0) / 100) * (item.quantity || 1)).toLocaleString()}
              </span>
              {item.discount && item.discount > 0 ? (
                <span className="text-[10px] text-gray-400 line-through">
                  ৳{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
