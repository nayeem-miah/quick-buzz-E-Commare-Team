/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { ImSpinner9 } from 'react-icons/im';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/UseAuth';
import usePublic from '../../Hooks/UsePublic';
import logo from '../../assets/Image/logo2.png';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = usePublic();
  const { createUser, signInWithGoogle, setLoading, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
        photo: result.user?.photoURL,
        role: 'user',
      };
      await axiosPublic.post('/users', userInfo);
      toast.success('Google Sign-In Successful');
      window.setTimeout(() => navigate('/'), 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google Sign-In Failed';
      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await createUser(email, password, name, logo);
      const userInfo = {
        name,
        email,
        photo: logo,
        role: 'user',
      };
      await axiosPublic.post('/users', userInfo);
      setLoading(false);
      toast.success('Account created successfully.');
      window.setTimeout(() => navigate(location?.state ? location.state : '/'), 900);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-orange-100/40 sm:p-8">
        <div className="text-center">
          <Link to="/" className="inline-flex justify-center">
            <img src={logo} alt="QuickBuzz" className="h-16 w-auto object-contain" />
          </Link>
          <h1 className="mt-5 text-2xl font-bold text-gray-950">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">Join QuickBuzz and shop smarter.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <AuthInput
            id="name"
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            icon={<User className="h-5 w-5" />}
          />
          <AuthInput
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-5 w-5" />}
          />
          <PasswordInput
            id="password"
            name="password"
            label="Password"
            showPassword={showPassword}
            onToggle={() => setShowPassword((current) => !current)}
          />
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            showPassword={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((current) => !current)}
          />

          <button
            disabled={loading}
            type="submit"
            className="btn min-h-12 w-full border-0 bg-orange-400 font-bold text-gray-950 shadow-none hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <ImSpinner9 size={18} className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-100" />
          <span className="text-xs font-medium text-gray-400">or continue with</span>
          <span className="h-px flex-1 bg-gray-100" />
        </div>

        <button
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FcGoogle size={24} /> Continue with Google
        </button>

        <p className="mt-7 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

interface AuthInputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
}

const AuthInput = ({ id, name, label, type, placeholder, icon }: AuthInputProps) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
      <input
        type={type}
        id={id}
        name={name}
        required
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
    </div>
  </div>
);

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  showPassword: boolean;
  onToggle: () => void;
}

const PasswordInput = ({ id, name, label, showPassword, onToggle }: PasswordInputProps) => (
  <div>
    <label htmlFor={id} className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative">
      <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        required
        placeholder="Enter your password"
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-gray-400 transition hover:bg-orange-50 hover:text-orange-600"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

export default Signup;
