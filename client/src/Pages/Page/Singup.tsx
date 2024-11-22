import React, { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb'; // Spinner icon
import usePublic from '../../Hooks/UsePublic';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = usePublic();
  const { createUser, signInWithGoogle, setLoading, loading } = useContext(AuthContext) || {};

  // Ensure required context methods are available
  if (!createUser || !signInWithGoogle || !setLoading) {
    console.error('AuthContext is not properly initialized.');
    return null;
  }

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle(); 
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
        photo: result.user?.photoURL,
        role: 'user',
      };
      axiosPublic.post('/users', userInfo);
      navigate('/');
      toast.success('Google Sign-In Successful');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const imageFile = (form.elements.namedItem('image') as HTMLInputElement).files?.[0];

   

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      setLoading(true);
      // Upload image
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      );
      const imageUrl = data.data.display_url;

      // Register user
      await createUser(email, password, name, imageUrl);
      toast.success("user Create successfully");
      const userInfo = {
        name: name,
        email: email,
        photo: imageUrl,
        role: "user"
      };
      axiosPublic.post("/users", userInfo).then(res => {
        if (res.data.insertedId) {
          // setSuccess("User created successfully");
          navigate(location?.state ? location.state : "/");
        }
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      toast.error(err.message || 'Signup Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Sign Up</h1>
          <p className='text-sm text-gray-400'>Welcome to StayVista</p>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='name' className='block mb-2 text-sm'>
                Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Enter Your Name Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900'
                required
              />
            </div>
            <div>
              <label htmlFor='image' className='block mb-2 text-sm'>
                Select Image:
              </label>
              <input
                type='file'
                id='image'
                name='image'
                accept='image/*'
                required
              />
            </div>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Email address
              </label>
              <input
                type='email'
                name='email'
                id='email'
                required
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900'
              />
            </div>
            <div>
              <label htmlFor='password' className='text-sm mb-2'>
                Password
              </label>
              <input
                type='password'
                name='password'
                autoComplete='new-password'
                id='password'
                required
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-rose-500 bg-gray-200 text-gray-900'
              />
            </div>
          </div>
          <div>
            <button
              disabled={loading}
              type='submit'
              className='bg-rose-500 w-full rounded-md py-3 text-white'
            >
              {loading ? (
                <TbFidgetSpinner className='animate-spin m-auto' />
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>
        <div className='flex items-center pt-4 space-x-1'>
          <div className='flex-1 h-px sm:w-16 bg-gray-300'></div>
          <p className='px-3 text-sm text-gray-400'>Signup with social accounts</p>
          <div className='flex-1 h-px sm:w-16 bg-gray-300'></div>
        </div>
        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className='disabled:cursor-not-allowed flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 cursor-pointer'
        >
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </button>
        <p className='px-6 text-sm text-center text-gray-400'>
          Already have an account?{' '}
          <Link to='/login' className='hover:underline hover:text-rose-500 text-gray-600'>
            Login
          </Link>.
        </p>
      </div>
      <Toaster />
    </div>
  );
};

export default Signup;
