import React from "react";
import { FiLogOut, FiMail, FiShield, FiCamera } from "react-icons/fi";

interface ProfileHeaderProps {
  user: {
    photoURL: string | null;
    displayName: string | null;
    email: string | null;
  };
  roleInfo: {
    label: string;
    style: string;
  };
  handleLogout: () => void;
  onImageUpload: (file: File) => void;
  isUploading: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  roleInfo,
  handleLogout,
  onImageUpload,
  isUploading,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-center p-6 gap-6">
      {/* Interactive Avatar Container */}
      <div className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-orange-100 shadow-sm flex-shrink-0 cursor-pointer">
        <img
          src={user.photoURL || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
        {/* Hover Overlay with text and camera icon */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 gap-1 select-none">
          <FiCamera size={18} />
          <span className="text-[9px] font-bold uppercase tracking-wider">Change</span>
        </div>
        {/* Uploading Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {/* Hidden File Input covering the area */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpload(file);
          }}
          disabled={isUploading}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      <div className="text-center md:text-left flex-1 space-y-1">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h1 className="text-2xl font-black text-gray-950">
            {user.displayName || "Anonymous User"}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider mx-auto md:mx-0 w-max ${roleInfo.style}`}
          >
            <FiShield className="mr-1" /> {roleInfo.label}
          </span>
        </div>
        <p className="text-sm text-gray-500 font-medium flex items-center justify-center md:justify-start gap-1.5">
          <FiMail className="text-gray-400" /> {user.email}
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
      >
        <FiLogOut /> Sign Out
      </button>
    </div>
  );
};

export default ProfileHeader;
