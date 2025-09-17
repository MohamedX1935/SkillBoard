import React from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth.js';

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button className="lg:hidden">
          <Bars3Icon className="h-6 w-6 text-slate-500" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-secondary">Bienvenue {user?.name}</h2>
          <p className="text-sm text-slate-500">{user?.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-secondary transition hover:bg-slate-100"
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
};

export default TopBar;
