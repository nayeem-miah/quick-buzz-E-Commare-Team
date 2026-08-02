/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { ImSpinner9 } from 'react-icons/im';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../Hooks/UseAuth';
import usePublic from '../../Hooks/UsePublic';
import logo from '../../assets/Image/logo2.png';

const demoAccounts = [
  { role: 'Admin', email: 'quick.buzz@gmail.com', password: '123456' },
  { role: 'Host', email: 'host.quickbuzz@gmail.com', password: '123456' },
  { role: 'User', email: 'user.quickbuzz@gmail.com', password: '123456' },
];

const getAuthErrorMessage = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error || '');

  if (message.includes('INVALID_LOGIN_CREDENTIALS') || message.includes('auth/invalid-credential')) {
    return 'Invalid email or password.';
  }

  if (message.includes('auth/user-not-found')) {
    return 'No account found with this email.';
  }

  if (message.includes('auth/wrong-password')) {
    return 'Incorrect password. Please try again.';
  }

  if (message.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }

  if (message.includes('auth/network-request-failed')) {
    return 'Network error. Please check your connection.';
  }

  return 'Something went wrong. Please try again.';
};

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = usePublic();
  const from = (location.state as { from?: string } | null)?.from || '/dashboard';
  const { signInWithGoogle, signIn, resetPassword, loading, setLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSignIn(email, password);
  };

  const handleSignIn = async (loginEmail: string, loginPassword: string) => {
    try {
      setLoading(true);
      await signIn(loginEmail, loginPassword);
      navigate(from);
      toast.success('Login Successful');
    } catch (err: unknown) {
      toast.error(getAuthErrorMessage(err as { code?: string; message?: string }));
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleSignIn(demoEmail, demoPassword);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }

    try {
      await resetPassword(email);
      toast.success('Password reset email sent.');
    } catch (err: unknown) {
      toast.error(getAuthErrorMessage(err as { code?: string; message?: string }));
      setLoading(false);
    }
  };

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
      navigate(from);
      toast.success('Google Sign-In Successful');
    } catch (err: unknown) {
      toast.error(getAuthErrorMessage(err as { code?: string; message?: string }));
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
          <h1 className="mt-5 text-2xl font-bold text-gray-950">Sign in to QuickBuzz</h1>
          <p className="mt-2 text-sm text-gray-500">Welcome back. Continue shopping faster.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-12 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-gray-400 transition hover:bg-orange-50 hover:text-orange-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={handleForgotPassword} className="text-sm font-semibold text-orange-600 hover:text-orange-700">
              Forgot password?
            </button>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="btn min-h-12 w-full border-0 bg-orange-400 font-bold text-gray-950 shadow-none hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <ImSpinner9 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-gray-100" />
          <span className="text-xs font-medium text-gray-400">or continue with</span>
          <span className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="space-y-3">
          <button
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FcGoogle size={24} /> Continue with Google
          </button>

          <div className="grid gap-2 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <button
                key={account.role}
                disabled={loading}
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="min-h-11 rounded-xl border border-orange-200 bg-orange-50 text-sm font-bold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
              >
                {account.role}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-7 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-bold text-orange-600 hover:text-orange-700">
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Signin;
