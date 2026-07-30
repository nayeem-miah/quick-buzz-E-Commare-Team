/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaStore } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/UseAuth";
import useAxiosPublic from "../../../Hooks/UsePublic";
import LoadingSpinner from "../../../Shared/Loading";

const SellerRequest: React.FC = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  // get host request data in every single email
  const { data: sellerData = null, isLoading, refetch } = useQuery({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/seller/single-seller/${user?.email}`);
      return res.data.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  // delete data
  const handleDelete = async (id: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f97316",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axiosPublic.delete(`/seller/${id}`)
            .then((res) => {
              if (res.data.data.deletedCount > 0) {
                refetch();
                Swal.fire({
                  title: "Deleted!",
                  text: "Your request has been deleted.",
                  icon: "success",
                  confirmButtonColor: "#f97316",
                });
              }
            });
        }
      });
    } catch (err: unknown) {
      console.log(err);
    }
  };

  // Become Seller Promo Empty State
  const renderPromoState = () => (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-6 animate-fadeIn mt-8">
      <div className="w-16 h-16 bg-orange-50 rounded-full mx-auto flex items-center justify-center text-orange-500">
        <FaStore size={26} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-950">Start Selling on QuickBuzz</h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          Join our growing marketplace and reach thousands of buyers every day. Sell your products with ease.
        </p>
      </div>

      {/* Benefits List */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-left max-w-md mx-auto space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Why Join QuickBuzz?</h3>
        <div className="flex items-start gap-2.5 text-xs text-gray-600">
          <span className="text-orange-500 font-bold">✓</span>
          <p><strong>Huge Customer Reach:</strong> Immediately showcase your products to active buyers.</p>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-gray-600">
          <span className="text-orange-500 font-bold">✓</span>
          <p><strong>Low Commission Fees:</strong> Keep more of your hard-earned sales revenues.</p>
        </div>
        <div className="flex items-start gap-2.5 text-xs text-gray-600">
          <span className="text-orange-500 font-bold">✓</span>
          <p><strong>Secure Payments:</strong> Get paid quickly and reliably directly to your account.</p>
        </div>
      </div>

      <div className="pt-2">
        <Link to="/become-host" className="inline-block">
          <button className="px-8 py-3 text-white bg-orange-500 hover:bg-orange-600 font-semibold rounded-xl transition duration-300 shadow-md shadow-orange-500/10">
            Apply to Become a Seller
          </button>
        </Link>
      </div>
    </div>
  );

  if (!sellerData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900">Become a Seller</h1>
          <p className="text-sm text-gray-500 mt-1">
            Grow your business by listing and selling products on QuickBuzz
          </p>
        </div>
        {renderPromoState()}
      </div>
    );
  }

  const {
    sellerName,
    sellerEmail,
    sellerPhoto,
    mobile,
    reason,
    address,
    other,
    imageUrl,
    adminIsApproved,
    decline,
  } = sellerData;

  const isApproved = adminIsApproved === "Approved";
  const isDeclined = adminIsApproved === "Declined" || (decline && decline.trim().length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Seller Request status</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review the status of your application to become a QuickBuzz seller
        </p>
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeIn">
        {/* Image Section */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Seller Product"
            className="w-full h-56 object-cover border-b border-gray-100"
          />
        )}

        {/* Seller Details Section */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={sellerPhoto || "https://via.placeholder.com/150"}
                alt={sellerName}
                className="w-14 h-14 rounded-full object-cover mr-4 border border-gray-200"
              />
              <div>
                <h2 className="text-lg font-bold text-gray-950">
                  {sellerName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">{sellerEmail}</p>
              </div>
            </div>
            
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                isApproved
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : isDeclined
                  ? "bg-rose-50 text-rose-700 border-rose-100"
                  : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
              }`}
            >
              {isApproved ? "Approved" : isDeclined ? "Declined" : "Pending Approval"}
            </span>
          </div>

          {/* Decline Reason Banner */}
          {isDeclined && decline && (
            <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100/50 space-y-1">
              <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Decline Reason</p>
              <p className="text-xs text-red-700 leading-relaxed font-semibold">{decline}</p>
            </div>
          )}

          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm">
            <div className="flex justify-between py-1 border-b border-gray-200/50">
              <span className="text-gray-400 font-semibold">Mobile</span>
              <span className="font-bold text-gray-700">{mobile || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200/50">
              <span className="text-gray-400 font-semibold">Reason to Sell</span>
              <span className="font-semibold text-gray-700">{reason || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200/50">
              <span className="text-gray-400 font-semibold">Address</span>
              <span className="font-semibold text-gray-700">{address || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400 font-semibold">Other Details</span>
              <span className="font-semibold text-gray-700">{other || "N/A"}</span>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to={`/updated-seller/${sellerData._id}`}
              className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shadow-orange-500/30"
            >
              <FiEdit2 size={13} /> Edit
            </Link>
            <button
              onClick={() => handleDelete(sellerData._id)}
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm shadow-red-500/30"
            >
              <MdDeleteForever size={15} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;
