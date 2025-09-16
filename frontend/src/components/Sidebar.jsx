import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Squares2X2Icon,
  UsersIcon,
  RocketLaunchIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth.js';

const navigation = [
  { name: 'Tableau de bord', to: '/', icon: Squares2X2Icon },
  { name: 'Utilisateurs', to: '/users', icon: UsersIcon, adminOnly: true },
  { name: 'Compétences', to: '/skills', icon: RocketLaunchIcon },
  { name: 'Formations', to: '/trainings', icon: AcademicCapIcon }
];

const Sidebar = () => {
  const { user } = useAuth();
  const visibleNavigation = navigation.filter((item) => !item.adminOnly || user?.role === 'Admin');

  return (
    <aside className="hidden w-64 flex-shrink-0 bg-white shadow-lg lg:block">
      <div className="flex h-full flex-col">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-primary">SkillBoard</h1>
          <p className="mt-1 text-sm text-slate-500">Suivi des compétences et formations</p>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
