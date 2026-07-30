import React from "react";
import { FiCheck, FiInfo, FiTrash2, FiX } from "react-icons/fi";
interface SellerDetails {
  sellerName: string;
  sellerEmail: string;
  sellerPhoto: string;
  imageUrl: string;
  mobile: number;
  reason: string;
  other: string;
  address: string;
  _id: number;
  adminIsApproved: string;
  decline?: string;
}

interface SellerRequestsTableProps {
  sellers: SellerDetails[];
  onDetailsClick: (seller: SellerDetails) => void;
  onApprove: (seller: SellerDetails) => void;
  onDecline: (seller: SellerDetails) => void;
  onDelete: (id: string) => void;
}

export const SellerRequestsTable: React.FC<SellerRequestsTableProps> = ({
  sellers,
  onDetailsClick,
  onApprove,
  onDecline,
  onDelete,
}) => {
  return (
    <div className="hidden md:block overflow-visible w-full min-h-[480px]">
      <table className="w-full min-w-full text-left border-collapse whitespace-nowrap table-fixed">
        <colgroup>
          <col className="w-[32%]" />
          <col className="w-[20%]" />
          <col className="w-[18%]" />
          <col className="w-[18%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead>
          <tr className="bg-gray-50/40 border-b border-gray-100 text-gray-550 text-xs font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-6 font-semibold">User</th>
            <th className="py-3.5 px-6 font-semibold">Mobile</th>
            <th className="py-3.5 px-6 font-semibold">Status</th>
            <th className="py-3.5 px-6 font-semibold">Address</th>
            <th className="py-3.5 px-6 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50/60">
          {sellers.map((seller: SellerDetails, id: number) => {
            const isApproved = seller.adminIsApproved === "Approved";
            const isDeclined = seller.adminIsApproved === "Declined" || (seller.decline ? seller.decline.trim().length > 0 : false);
            const isPending = !isApproved && !isDeclined;

            return (
              <tr key={seller._id || id} className="hover:bg-gray-50/70 transition-colors duration-150 group">
                <td className="py-3 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      className="h-9 w-9 rounded-full object-cover border border-gray-200/50 shadow-sm"
                      src={seller.sellerPhoto || "https://i.ibb.co/311H3rd/default-avatar.png"}
                      alt={seller.sellerName}
                    />
                    <div className="truncate flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate" title={seller.sellerName}>
                        {seller.sellerName}
                      </p>
                      <p className="text-xs text-gray-500 truncate" title={seller.sellerEmail}>
                        {seller.sellerEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-6 text-xs text-gray-650 font-medium">
                  {seller.mobile || "N/A"}
                </td>
                <td className="py-3 px-6">
                  {isApproved ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-55/50 px-2.5 py-1 rounded-full border border-emerald-100/50 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Approved
                    </div>
                  ) : isDeclined ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50/50 px-2.5 py-1 rounded-full border border-rose-100/50 w-max" title={seller.decline}>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Declined
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50/50 px-2.5 py-1 rounded-full border border-amber-100/50 w-max">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Pending
                    </div>
                  )}
                </td>
                <td className="py-3 px-6 text-xs text-gray-550 truncate" title={seller.address}>
                  {seller.address || "N/A"}
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDetailsClick(seller)}
                      className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <FiInfo className="text-base" />
                    </button>
                    {isPending && (
                      <>
                        <button
                          onClick={() => onApprove(seller)}
                          className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Approve Seller"
                        >
                          <FiCheck className="text-base" />
                        </button>
                        <button
                          onClick={() => onDecline(seller)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Decline Seller"
                        >
                          <FiX className="text-base" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDelete(String(seller._id))}
                      className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Application"
                    >
                      <FiTrash2 className="text-base" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
