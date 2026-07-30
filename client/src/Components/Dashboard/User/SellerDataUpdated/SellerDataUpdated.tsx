import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaStore } from "react-icons/fa";
import { FiFileText, FiLink, FiMapPin, FiPhone, FiTrash2, FiUpload, FiUser } from "react-icons/fi";
import { ImSpinner } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../../Hooks/UseAuth";
import useAxiosPublic from "../../../../Hooks/UsePublic";

const SellerDataUpdated: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: sellerData = null } = useQuery({
    queryKey: ["sellerData"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/seller/single-seller/${user?.email}`);
      return res.data.data;
    },
  });

  React.useEffect(() => {
    if (sellerData?.imageUrl) {
      setImagePreview(sellerData.imageUrl);
    }
  }, [sellerData]);

  const validateAndSetFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPG, JPEG, or PNG)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds the 10MB limit");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

    try {
      setLoading(true);

      let imageUrl = sellerData?.imageUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);


        const { data } = await axiosPublic.post(
          "/upload/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = data.data.display_url;
      }

      const updatedSellerData = {
        sellerName: name || user?.displayName,
        sellerEmail: user?.email,
        sellerPhoto: user?.photoURL,
        mobile,
        reason,
        address,
        other,
        imageUrl,
      };

      const res = await axiosPublic.patch(`/seller/${sellerData?._id}`, updatedSellerData);
      if (res.data.data.modifiedCount > 0) {
        toast(
          <div className="flex items-center">
            <div className="w-6 h-6 flex items-center justify-center bg-green-500 text-white rounded-full mr-3">
              âœ“
            </div>
            <span>Seller data updated successfully!</span>
          </div>
        );
        navigate("/dashboard/seller-request");
      }
    } catch (err) {
      console.error("seller details addition failed:", err);
      toast.error("Failed to update seller details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm space-y-8 animate-fadeIn">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-orange-50 rounded-2xl mx-auto flex items-center justify-center text-orange-500 mb-2 transition-transform duration-300 hover:scale-105">
            <FaStore size={26} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Update Seller Information
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            Update your seller details and re-upload your NID/Passport document.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields Grid */}
          <div className="space-y-5">
            {/* Owner Name */}
            <div className="space-y-1.5 group">
              <label htmlFor="name" className="text-xs font-semibold text-gray-600 block transition-colors duration-200 group-focus-within:text-orange-500">
                Owner Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
                  <FiUser size={16} />
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={sellerData?.sellerName || user?.displayName || ""}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-orange-400 rounded-xl outline-none transition duration-200 text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-orange-100/50"
                  placeholder="e.g. John Doe"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5 group">
              <label htmlFor="mobile" className="text-xs font-semibold text-gray-600 block transition-colors duration-200 group-focus-within:text-orange-500">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
                  <FiPhone size={16} />
                </span>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  defaultValue={sellerData?.mobile}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-orange-400 rounded-xl outline-none transition duration-200 text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-orange-100/50"
                  placeholder="e.g. 017XXXXXXXX"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5 group">
              <label htmlFor="address" className="text-xs font-semibold text-gray-600 block transition-colors duration-200 group-focus-within:text-orange-500">
                Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
                  <FiMapPin size={16} />
                </span>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={sellerData?.address}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-orange-400 rounded-xl outline-none transition duration-200 text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-orange-100/50"
                  placeholder="e.g. Road 4, Banani, Dhaka"
                />
              </div>
            </div>

            {/* Business Description */}
            <div className="space-y-1.5 group">
              <label htmlFor="reason" className="text-xs font-semibold text-gray-600 block transition-colors duration-200 group-focus-within:text-orange-500">
                Why should you become a seller?
              </label>
              <div className="relative">
                <span className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
                  <FiFileText size={16} />
                </span>
                <textarea
                  id="reason"
                  name="reason"
                  defaultValue={sellerData?.reason}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-orange-400 rounded-xl outline-none transition duration-200 text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-orange-100/50 resize-y"
                  placeholder="Explain why you want to be a seller"
                  rows={4}
                />
              </div>
            </div>

            {/* Verification Image Upload & Preview */}
            <div className="space-y-2 group">
              <label className="text-xs font-semibold text-gray-600 block transition-colors duration-200 group-focus-within:text-orange-500">
                Passport or NID card
              </label>

              {imagePreview ? (
                <div className="border border-gray-200 rounded-2xl p-3 bg-gray-50/50 space-y-3">
                  <div className="relative group/preview rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Document Preview"
                      className="w-full h-44 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg transition duration-200 hover:scale-105"
                        title="Change image"
                      >
                        <FiUpload size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition duration-200 hover:scale-105"
                        title="Remove image"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-700 truncate" title={selectedFile?.name}>
                        {selectedFile?.name}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-[11px] font-semibold text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition duration-150 active:scale-95"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="px-3 py-1.5 text-[11px] font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition duration-150 active:scale-95"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group/upload text-center relative overflow-hidden ${
                    isDragActive
                      ? "border-orange-500 bg-orange-50/20 ring-4 ring-orange-100"
                      : "border-gray-200 hover:border-orange-400 bg-gray-50/30 hover:bg-orange-50/5"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${
                    isDragActive ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-400 group-hover/upload:bg-orange-50 group-hover/upload:text-orange-500"
                  }`}>
                    <FiUpload size={20} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1 group-hover/upload:text-orange-600 transition-colors duration-200">
                    {isDragActive ? "Drop the file here" : "Drag & drop your document"}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    or <span className="text-orange-500 hover:underline font-medium">browse files</span> from your device
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100/60 rounded-full text-[10px] text-gray-400 font-medium group-hover/upload:bg-orange-50 group-hover/upload:text-orange-600/80 transition-all duration-200">
                    <span>JPG, PNG</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 group-hover/upload:bg-orange-300"></span>
                    <span>Max 10MB</span>
                  </div>
                </div>
              )}

              <input
                id="passportImg"
                name="passportImg"
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Other Information */}
            <div className="space-y-1.5 group">
              <label htmlFor="other" className="text-xs font-semibold text-gray-600 block transition-colors duration-200 group-focus-within:text-orange-500">
                Other Information
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200">
                  <FiLink size={16} />
                </span>
                <input
                  type="text"
                  id="other"
                  name="other"
                  defaultValue={sellerData?.other}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-orange-400 rounded-xl outline-none transition duration-200 text-sm text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-orange-100/50"
                  placeholder="Provide any additional information (optional)"
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-4 space-y-3">
            <button
              disabled={loading}
              type="submit"
              className={`w-full py-3 text-white font-semibold rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 shadow-orange-500/30 active:scale-[0.98]"
              }`}
            >
              {loading ? (
                <>
                  <ImSpinner className="animate-spin" size={16} />
                  Updating...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerDataUpdated;
