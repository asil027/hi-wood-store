'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountClient({ user }: { user: any }) {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => logout()}
      className="btn-secondary text-xs py-2 px-4 inline-flex items-center gap-1.5 self-start sm:self-auto"
    >
      <LogOut className="w-3.5 h-3.5" />
      <span>Sign Out</span>
    </button>
  );
}
