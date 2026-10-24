'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E8E8E8] shadow-sm space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-0.5">
            <span className="text-3xl font-extrabold tracking-tight text-[#111111]">
              Hiwood
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A1F] ml-0.5"></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-neutral-500">
            Access your orders, track deliveries, and manage your wishlist.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="bg-orange-50 border border-orange-200/80 rounded-2xl p-4 text-xs space-y-1.5 text-neutral-700">
          <div className="font-bold text-[#FF5A1F] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Preset Login Credentials:</span>
          </div>
          <div>Admin: <strong className="font-mono text-neutral-900">admin@hiwood.pk</strong> / <strong className="font-mono text-neutral-900">AdminPassword123!</strong></div>
          <div>Customer: <strong className="font-mono text-neutral-900">ayesha@gmail.com</strong> / <strong className="font-mono text-neutral-900">Customer123!</strong></div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-neutral-700">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] font-semibold text-[#FF5A1F] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs font-bold shadow-lg shadow-orange-500/20"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Bottom Switch */}
        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-gray-100">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-[#FF5A1F] hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
