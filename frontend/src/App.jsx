import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import SkillsPage from './pages/SkillsPage.jsx';
import TrainingsPage from './pages/TrainingsPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route element={<ProtectedRoute roles={['Admin']} />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
          <Route path="skills" element={<SkillsPage />} />
          <Route path="trainings" element={<TrainingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
