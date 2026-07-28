import React, { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner } from "react-icons/im";
import useAxiosPublic from "../../../Hooks/UsePublic";
import { useNavigate } from "react-router-dom";
import { FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ApprovalStatus } from "../../../constants/enums";

interface SellerRequest {
  _id: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhoto?: string;
  imageUrl?: string;
  mobile: string;
  reason?: string;
  address: string;
  other?: string;
  adminIsApproved?: string;
  decline?: string;
}

interface SellerStatusViewProps {
  sellerRequest: SellerRequest;
  refetch: () => void;
}

const SellerStatusView: React.FC<SellerStatusViewProps> = ({ sellerRequest, refetch }) => {
  const [loading, setLoading] = useState(false);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleReapply = async () => {
    if (!sellerRequest) return;
    try {
      setLoading(true);
      await axiosPublic.delete(`/seller/${sellerRequest._id}`);
      toast.success("Previous application cleared. Feel free to apply again!");
      refetch();
    } catch (err) {
      console.error("Reapply failed:", err);
      toast.error("Failed to reset application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isApproved = sellerRequest.adminIsApproved === ApprovalStatus.APPROVED;
  const isDeclined = sellerRequest.decline && sellerRequest.decline.trim().length > 0;

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-6 animate-fadeIn">
      {isApproved ? (
        <div className="w-16 h-16 bg-green-50 rounded-full mx-auto flex items-center justify-center text-green-500">
          <FaCheckCircle size={32} />
        </div>
      ) : isDeclined ? (
        <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center text-red-500">
          <FaTimesCircle size={32} />
        </div>
      ) : (
        <div className="w-16 h-16 bg-orange-50 rounded-full mx-auto flex items-center justify-center text-orange-500">
          <FaClock className="animate-pulse" size={32} />
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">
          {isApproved
            ? "Application Approved!"
            : isDeclined
            ? "Application Declined"
            : "Application Under Review"}
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          {isApproved
            ? "Congratulations! You are now a registered seller on QuickBuzz. Go to your dashboard to manage your products."
            : isDeclined
            ? "Unfortunately, your application was not approved by our verification team at this time."
            : "We have received your application. Our admin team is currently reviewing your details and uploaded documents."}
        </p>
      </div>

      {isDeclined && (
        <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50 text-left max-w-md mx-auto">
          <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Decline Reason:</p>
          <p className="text-sm text-red-700 leading-relaxed font-semibold">{sellerRequest.decline}</p>
        </div>
      )}

      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-left max-w-md mx-auto space-y-3 text-xs">
        <h3 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Submitted Details</h3>
        <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
          <span className="text-gray-400 font-medium">Owner Name</span>
          <span className="font-semibold text-gray-800">{sellerRequest.sellerName}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
          <span className="text-gray-400 font-medium">Contact Phone</span>
          <span className="font-semibold text-gray-800">{sellerRequest.mobile}</span>
        </div>
        <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
          <span className="text-gray-400 font-medium">Address</span>
          <span className="font-semibold text-gray-700">{sellerRequest.address}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 font-medium">Status</span>
          <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border text-[9px] ${
            isApproved
              ? "bg-green-50 text-green-700 border-green-200"
              : isDeclined
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-orange-50 text-orange-700 border-orange-200"
          }`}>
            {isApproved ? "Approved" : isDeclined ? "Rejected" : "Pending"}
          </span>
        </div>
      </div>

      <div className="pt-2">
        {isDeclined ? (
          <button
            onClick={handleReapply}
            disabled={loading}
            className="w-full py-3 text-white bg-orange-500 hover:bg-orange-600 font-semibold rounded-xl transition duration-200 shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 mx-auto disabled:bg-orange-300"
          >
            {loading && <ImSpinner className="animate-spin" />}
            Reapply to Become Seller
          </button>
        ) : isApproved ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 text-white bg-green-600 hover:bg-green-700 font-semibold rounded-xl transition duration-200 shadow-md shadow-green-500/10 mx-auto"
          >
            Go to Dashboard
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 italic">
              Note: Application will be reviewed within 24-48 hours
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-2.5 text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 border border-gray-200 font-medium rounded-xl transition duration-200 text-sm"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerStatusView;
