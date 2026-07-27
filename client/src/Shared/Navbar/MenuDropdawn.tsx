import { useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import avatar from "../../../src/assets/Image/avatar.jpg";
import useAuth from "../../Hooks/UseAuth";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";

const MenuDropdown: React.FC = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { singleUser } = useFetchSingleUser(user?.email as string);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      <div className="flex flex-row items-center gap-3">
        {/* Dropdown button */}
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="py-1.5 px-2.5 border border-gray-300 hover:border-orange-400 flex flex-row items-center gap-2 rounded-full cursor-pointer hover:shadow-sm transition-all duration-300 bg-white"
        >
          <AiOutlineMenu className="text-gray-600" />
          <div className="hidden md:block">
            <img
              className="rounded-full border border-gray-100"
              referrerPolicy="no-referrer"
              src={user && user.photoURL ? user.photoURL : avatar}
              alt="profile"
              height={26}
              width={26}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-lg w-40 md:w-52 bg-white border border-gray-100 overflow-hidden right-0 top-12 text-sm z-50 py-1">
          <div className="flex flex-col">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition font-medium text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition font-medium text-gray-700"
                >
                  My Profile
                </Link>
                {singleUser?.role === "user" && (
                  <Link
                    to="/dashboard/my-listings"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition font-medium text-gray-700"
                  >
                    My Cart
                  </Link>
                )}
                {singleUser?.role === "user" && (
                  <Link
                    to="/become-host"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition font-medium text-gray-700"
                  >
                    Become a Seller
                  </Link>
                )}
                <hr className="border-gray-100 my-1" />
                <div
                  onClick={() => {
                    logOut();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-red-500 transition font-medium text-gray-700 cursor-pointer"
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition font-medium text-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 hover:bg-orange-50 hover:text-orange-500 transition font-medium text-gray-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropdown;
