import React, { useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link,  useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Provider/AuthProvider';
import axios from 'axios';
import { toast } from 'react-toastify';


const Signup: React.FC = () => {
    const navigate = useNavigate()
    const { createUser, signInWithGoogle,setLoading } = useContext(AuthContext);

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            console.log("Google Sign-In successful");
        } catch (error) {
            console.error("Google Sign-In error:", error);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const image = form.image.files ? form.image.files[0] : null;

        console.log(name, email, password, image);


        const formData = new FormData()
    formData.append('image', image)

    try {
      setLoading(true)
      // 1. Upload image and get image url
      const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        formData
      )
      console.log(data.data.display_url)

      //2. User Registration
      const result = await createUser(email, password)
      console.log(result)

      // 3. Save username and photo in firebase
    
      navigate('/')
      toast.success('Signup Successful')
    } catch (err) {
      console.log(err)
      toast.error(error.message)
    }






        // Add your signup logic here (e.g., calling createUser function)
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
                            />
                        </div>
                        <div>
                            <label htmlFor='image' className='block mb-2 text-sm'>
                                Select Image:
                            </label>
                            <input
                                required
                                type='file'
                                id='image'
                                name='image'
                                accept='image/*'
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
                            <div className='flex justify-between'>
                                <label htmlFor='password' className='text-sm mb-2'>
                                    Password
                                </label>
                            </div>
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
                        <button type='submit' className='bg-rose-500 w-full rounded-md py-3 text-white'>
                            Continue
                        </button>
                    </div>
                </form>
                <div className='flex items-center pt-4 space-x-1'>
                    <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
                    <p className='px-3 text-sm dark:text-gray-400'>
                        Signup with social accounts
                    </p>
                    <div className='flex-1 h-px sm:w-16 dark:bg-gray-700'></div>
                </div>
                <div
                    onClick={handleGoogleSignIn}
                    className='flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer'
                >
                    <FcGoogle size={32} />
                    <p>Continue with Google</p>
                </div>
                <p className='px-6 text-sm text-center text-gray-400'>
                    Already have an account?{' '}
                    <Link to='/login' className='hover:underline hover:text-rose-500 text-gray-600'>
                        Login
                    </Link>.
                </p>
            </div>
        </div>
    );
};

export default Signup;
