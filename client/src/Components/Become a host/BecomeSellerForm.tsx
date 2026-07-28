import React, { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner } from "react-icons/im";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/UseAuth";
import useAxiosPublic from "../../Hooks/UsePublic";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStore, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const BecomeSellerForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  // Fetch current user seller application status
  const { data: sellerRequest = null, isLoading: isStatusLoading, refetch } = useQuery({
    queryKey: ["sellerRequest", user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/seller/single-seller/${user?.email}`);
      return res.data.data;
    },
    enabled: !!user?.email,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement).value;
    const reason = (form.elements.namedItem("reason") as HTMLTextAreaElement).value;
    const address = (form.elements.namedItem("address") as HTMLInputElement).value;
    const other = (form.elements.namedItem("other") as HTMLInputElement).value;
    const imageFile = (form.elements.namedItem("passportImg") as HTMLInputElement).files?.[0];

    if (!imageFile) {
      toast.error("Please select an image file (Passport/NID)");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setLoading(true);
      // Upload image to ImgBB
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );
      const imageUrl = data.data.display_url;

      const sellerData = {
        sellerName: name || user?.displayName,
        sellerEmail: user?.email,
        sellerPhoto: user?.photoURL,
        mobile,
        reason,
        address,
        other,
        imageUrl,
        decline: "",
      };

      await axiosPublic.post("/seller", sellerData).then((res) => {
        if (res.data.success || res.data.data?.insertedId) {
          toast.success("Application submitted successfully!");
          form.reset();
          refetch();
        } else {
          toast.error("You have already sent your details!");
        }
      });
    } catch (err) {
      console.error("Seller registration failed:", err);
      toast.error("Failed to submit application. Please check your image size/format.");
    } finally {
      setLoading(false);
    }
  };

  if (isStatusLoading) return <div className="flex justify-center py-12"><ImSpinner className="animate-spin text-orange-500" size={32} /></div>;

  // Render Status view if user already applied
  if (sellerRequest) {
    const isApproved = sellerRequest.adminIsApproved === "approve";
    const isDeclined = sellerRequest.decline && sellerRequest.decline.trim().length > 0;

    return (
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center space-y-6 animate-fadeIn">
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
          <h2 className="text-2xl font-bold text-gray-950">
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

        {/* Decline reason details */}
        {isDeclined && (
          <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50 text-left max-w-md mx-auto">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Decline Reason:</p>
            <p className="text-sm text-red-700 leading-relaxed font-semibold">{sellerRequest.decline}</p>
          </div>
        )}

        {/* Application details block */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-left max-w-md mx-auto space-y-3 text-xs">
          <h3 className="font-bold text-gray-400 uppercase tracking-wider mb-2">Submitted Details</h3>
          <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
            <span className="text-gray-400 font-medium">Business Name</span>
            <span className="font-bold text-gray-800">{sellerRequest.sellerName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
            <span className="text-gray-400 font-medium">Contact Phone</span>
            <span className="font-bold text-gray-800">{sellerRequest.mobile}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200/50 pb-1.5">
            <span className="text-gray-400 font-medium">Store Address</span>
            <span className="font-semibold text-gray-700">{sellerRequest.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 font-medium">Application Status</span>
            <span className={`px-2 py-0.5 rounded-full font-black uppercase tracking-wider border text-[9px] ${
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

        {/* Action button */}
        <div className="pt-2">
          {isDeclined ? (
            <button
              onClick={handleReapply}
              disabled={loading}
              className="px-8 py-3 text-white bg-orange-500 hover:bg-orange-600 font-bold rounded-xl transition duration-300 shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 mx-auto disabled:bg-orange-300"
            >
              {loading && <ImSpinner className="animate-spin" />}
              Reapply to Become Seller
            </button>
          ) : isApproved ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-8 py-3 text-white bg-green-600 hover:bg-green-700 font-bold rounded-xl transition duration-300 shadow-md shadow-green-500/10 mx-auto"
            >
              Go to Dashboard
            </button>
          ) : (
            <p className="text-xs text-gray-400 italic">
              Our support team will review your application. Check back soon.
            </p>
          )}
        </div>
      </div>
    );
  }

  // Render Apply Form
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-orange-50 rounded-full mx-auto flex items-center justify-center text-orange-500">
          <FaStore size={22} />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Apply to Become a Seller
        </h2>
        <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
          Open your storefront on QuickBuzz today and connect with thousands of active shoppers looking for unique products.
        </p>
      </div>

      {/* Why Join QuickBuzz? benefits section */}
      <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-left space-y-3">
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

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Store Owner Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={user?.displayName || ""}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              placeholder="Enter owner name"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="mobile" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Contact Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
              placeholder="Enter mobile number"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="address" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Store / Warehouse Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
            placeholder="Enter physical business address"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="reason" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Tell us about your business & products
          </label>
          <textarea
            id="reason"
            name="reason"
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
            placeholder="What products do you plan to sell on QuickBuzz?"
            rows={3}
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor="passportImg">
            Verification Image (Passport / NID Card)
          </label>
          <input
            id="passportImg"
            name="passportImg"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition"
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="other" className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Additional Links / Notes (Optional)
          </label>
          <input
            type="text"
            id="other"
            name="other"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition text-sm text-gray-800"
            placeholder="e.g. website link, portfolio, or Facebook page"
          />
        </div>

        <div className="pt-2 space-y-3">
          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-md ${
              loading
                ? "bg-orange-300 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/10"
            }`}
          >
            {loading ? (
              <>
                <ImSpinner className="animate-spin" size={16} />
                Submitting Application...
              </>
            ) : (
              "Apply to Become a Seller"
            )}
          </button>
          <p className="text-[10px] text-gray-400 italic text-center">
            Note: Application will be reviewed within 24-48 hours
          </p>
        </div>
      </form>
    </div>
  );
};

export default BecomeSellerForm;
