import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import useAuth from "../../Hooks/UseAuth";
import avatar from "../../../src/assets/Image/avatar.jpg";
import useFetchSingleUser from "../../Hooks/UseFindSingleUser";
import { MdLocalGroceryStore } from "react-icons/md";

const MenuDropdown: React.FC = () => {
  const { user, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { singleUser } = useFetchSingleUser(user?.email);

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
          className="p-4 md:py-1 md:px-2 border border-black flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <img
              className="rounded-full"
              referrerPolicy="no-referrer"
              src={user && user.photoURL ? user.photoURL : avatar}
              alt="profile"
              height={30}
              width={30}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-40 md:w-56 bg-white overflow-hidden right-0 top-12 text-sm">
          <div className="flex flex-col cursor-pointer">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  my profile
                </Link>
                {singleUser?.role === "user" && (
                  <Link
                    to="/dashboard/my-listings"
                    className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                  >
                    <h3 className="flex items-center gap-3">
                      Go to my Add to Cart{" "}
                      <span>
                        <MdLocalGroceryStore className="text-orange-600 text-2xl mx-auto" />
                      </span>{" "}
                    </h3>
                  </Link>
                )}
                {singleUser?.role === "user" && (
                  <Link
                    to="/become-host"
                    className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                  >
                    Become a Seller
                  </Link>
                )}
                <div
                  onClick={logOut}
                  className="px-4 py-3 hover:bg-neutral-100 hover:text-red-500 transition font-semibold cursor-pointer"
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-3 hover:bg-neutral-100 transition font-semibold"
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
