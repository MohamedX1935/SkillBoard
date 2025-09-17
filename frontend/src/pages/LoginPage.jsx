import React, { useState } from 'react';
import useAuth from '../hooks/useAuth.js';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-slate-100 to-secondary/10 p-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:grid-cols-2">
        <div className="hidden h-full flex-col justify-between bg-primary/10 px-8 py-10 sm:flex">
          <div>
            <h1 className="text-3xl font-bold text-secondary">SkillBoard</h1>
            <p className="mt-4 text-sm text-slate-600">
              Centralisez le suivi des compétences, optimisez les plans de formation et visualisez la progression de vos équipes.
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-500">
            <p>✔️ Gestion des rôles et des autorisations</p>
            <p>✔️ Tableaux de bord dynamiques</p>
            <p>✔️ Export rapide des rapports</p>
          </div>
        </div>
        <form className="space-y-6 px-8 py-10" onSubmit={handleSubmit}>
          <div>
            <h2 className="text-2xl font-semibold text-secondary">Connexion</h2>
            <p className="mt-2 text-sm text-slate-500">Accédez à votre espace de pilotage SkillBoard.</p>
          </div>
          {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-xs text-slate-400">
            Utilisez le compte administrateur par défaut défini dans le fichier .env pour gérer la plateforme.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
