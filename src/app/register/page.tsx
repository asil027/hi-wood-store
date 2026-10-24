'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const res = await register({ name, email, phone, password });
    setLoading(false);

    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Registration failed');
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
            Create Customer Account
          </h1>
          <p className="text-xs text-neutral-500">
            Join the Hiwood club for seamless checkout and exclusive offers.
          </p>
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
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Hassan Ali"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hassan@example.com"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0333 1234567"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">
              Create Password (min 6 chars) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-neutral-200 outline-none focus:border-[#FF5A1F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-xs font-bold shadow-lg shadow-orange-500/20"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-gray-100">
          Already registered?{' '}
          <Link href="/login" className="font-bold text-[#FF5A1F] hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
