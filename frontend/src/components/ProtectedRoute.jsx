import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const ProtectedRoute = ({ roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg font-semibold text-primary">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="rounded-lg bg-white p-10 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-secondary">Accès restreint</h2>
          <p className="mt-4 text-slate-600">
            Vous n'avez pas les droits nécessaires pour consulter cette page.
          </p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
