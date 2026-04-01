import React, { useState } from "react";
import useAuth from "../../Hooks/UseAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Shared/Navbar/Navbar";
import { FiUser, FiImage } from "react-icons/fi";
import { Helmet } from "react-helmet-async";

const UpdateProfile: React.FC = () => {
  const { updateUserProfile, user } = useAuth();
  const [name, setName] = useState<string>(user?.displayName || "");
  const [photo, setPhoto] = useState<string>(user?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !photo) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await updateUserProfile(name, photo);
      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Helmet>
        <title>quickBuzz | Update Profile</title>
      </Helmet>
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 py-20">
        <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Update Profile</h2>
            <p className="text-gray-500 text-sm md:text-base">
              Keep your details up to date to ensure a seamless shopping experience.
            </p>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none text-gray-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="photo" className="block text-sm font-semibold text-gray-700 mb-2">
                Photo URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiImage className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  id="photo"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="Enter a valid image URL"
                  className="w-full pl-11 pr-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 outline-none text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 shadow-lg mt-6 flex justify-center items-center
                ${loading 
                  ? "bg-blue-400 shadow-none cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 shadow-blue-500/30"
                }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Save Changes"
              )}
            </button>
          </form>
          
          {/* Avatar Preview Area */}
          {(photo || name) && (
            <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col items-center">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Preview</span>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {photo ? (
                  <img 
                    src={photo} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} 
                  />
                ) : (
                  <span className="text-3xl font-bold text-gray-300">{(name || "U").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <h3 className="mt-4 font-bold text-gray-800">{name || "Your Name"}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
