import React, { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner } from "react-icons/im";
import useAuth from "../../Hooks/UseAuth";
import useAxiosPublic from "../../Hooks/UsePublic";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BecomeSellerForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  // handle submit btn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement)
      .value;
    const reason = (form.elements.namedItem("reason") as HTMLTextAreaElement)
      .value;
    const address = (form.elements.namedItem("address") as HTMLInputElement)
      .value;
    const other = (form.elements.namedItem("other") as HTMLInputElement).value;
    const imageFile = (
      form.elements.namedItem("passportImg") as HTMLInputElement
    ).files?.[0];

    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    // form data in ing
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setLoading(true);
      // Upload image
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      );
      const imageUrl = data.data.display_url;
      
      // seller data
      const sellerData = {
        sellerName: name || user?.displayName,
        sellerEmail: user?.email,
        sellerPhoto: user?.photoURL,
        mobile,
        reason,
        address,
        other,
        imageUrl,
      };

      // console.log(sellerData);
      // seller data post in db
      await axiosPublic.post("/seller", sellerData).then((res) => {
        // console.log(res);
        if (res.data.insertedId) {
          toast.success("your request successfully ");
          form.reset();
          navigate("/dashboard/seller-request");
        } else {
          toast.error("already send your details !! ");
        }
      });
    } catch (err) {
      console.error("seller details addition failed:", err);
      toast.error("Failed to seller details. Please try again.");
    } finally {
      setLoading(false); // Reset loading to false once the process completes
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Become a Seller
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your mobile number"
          />
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your address"
          />
        </div>

        <div>
          <label
            htmlFor="reason"
            className="block text-sm font-medium text-gray-700"
          >
            Why should you become a seller?
          </label>
          <textarea
            id="reason"
            name="reason"
            required
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Explain why you want to be a seller"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="passportImg">
            Passport or nid card !!
          </label>
          <input
            id="passportImg"
            name="passportImg"
            type="file"
            accept="image/*"
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-200 rounded-md focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="other"
            className="block text-sm font-medium text-gray-700"
          >
            Other Information
          </label>
          <input
            type="text"
            id="other"
            name="other"
            className="w-full mt-1 px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Provide any additional information (optional)"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className={`w-full text-white   shadow-lg py-2 relative ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-indigo-600"
          } rounded-md transition-all duration-500 ease-in-out border-2 border-transparent`}
        >
          {loading ? (
            <ImSpinner size={20} className="animate-spin mx-auto "></ImSpinner>
          ) : (
            "submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default BecomeSellerForm;
