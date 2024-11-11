import { AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import React from 'react';
// Uncomment if needed: import useAuth from '../../../hooks/useAuth';
// Interface for User (Uncomment if needed)
// interface User {
//   photoURL?: string;
// }

const Navbar: React.FC = () => {
  // Uncomment if needed: const { user, logOut } = useAuth() as { user: User | null; logOut: () => void };
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className='fixed w-full bg-white z-10 shadow-sm'>
        <div className='py-4 border-b-[1px]'>
          <div className='flex flex-row items-center justify-between gap-3 md:gap-0'>
            {/* Logo */}
            <Link to='/'>
              <img
                src='https://i.ibb.co.com/d23jxyD/logo.jpg'
                alt='logo'
                width={50}
                height={500}
              />
            </Link>
            {/* Dropdown Menu */}
            <div className='relative'>
              <div className='flex flex-row items-center gap-3'>
                {/* Become A Host btn */}
                <div className='hidden md:block'>
                  {/* Uncomment if needed
                {!user && (
                  <button
                    disabled={!user}
                    className='disabled:cursor-not-allowed cursor-pointer hover:bg-neutral-100 py-3 px-4 text-sm font-semibold rounded-full transition'
                  >
                    Host your home
                  </button>
                )} */}
                </div>
                {/* Dropdown btn */}
                <div
                  onClick={() => setIsOpen(!isOpen)}
                  className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
                >
                  <AiOutlineMenu />
                  <div className='hidden md:block'>
                    {/* Avatar */}
                    <img
                      className='rounded-full'
                      referrerPolicy='no-referrer'
                      src=""
                      height={30}
                      width={30}
                    />
                  </div>
                </div>
              </div>
              {/* Dropdown Menu Items */}
              {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm'>
                  <div className='flex flex-col cursor-pointer'>
                    <Link
                      to='/'
                      className='block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                    >
                      Home
                    </Link>
                    {/* Conditionally Rendered User Links */}
                    {/* Uncomment if needed
                  {user ? (
                    <>
                      <Link
                        to='/dashboard'
                        className='block px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                      >
                        Dashboard
                      </Link>
                      <div
                        onClick={logOut}
                        className='px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer'
                      >
                        Logout
                      </div>
                    </>
                  ) : (
                  */}
                    <>
                      <Link
                        to='/login'
                        className='px-4 py-3 text-black hover:bg-neutral-100 transition font-semibold'
                      >
                        Login
                      </Link>
                      <Link
                        to='/signup'
                        className='px-4 text-black py-3 hover:bg-neutral-100 transition font-semibold'
                      >
                        Sign Up
                      </Link>
                    </>
                    {/* )} */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
