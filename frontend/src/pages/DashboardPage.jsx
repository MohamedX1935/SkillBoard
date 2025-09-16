import React, { useEffect, useState } from 'react';
import { ArrowDownTrayIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import PageHeader from '../components/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import { downloadReport, fetchMetrics } from '../services/dashboardService.js';

const colors = ['#2563eb', '#22c55e', '#facc15'];

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="mt-20 flex justify-center">
        <LoadingOverlay message="Chargement des indicateurs..." />
      </div>
    );
  }

  if (error) {
    return <div className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</div>;
  }

  if (!metrics) {
    return null;
  }

  const statusData = Object.entries(metrics.statusDistribution).map(([status, value], index) => ({
    name: status,
    value,
    color: colors[index % colors.length]
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de bord"
        description="Visualisez la dynamique des compétences et le suivi des formations."
        actions={[
          <button
            key="export"
            onClick={downloadReport}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <ArrowDownTrayIcon className="h-4 w-4" /> Exporter le rapport PDF
          </button>
        ]}
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Collaborateurs suivis" value={metrics.totalUsers} icon={UserGroupIcon} />
        <StatCard title="Niveau moyen global" value={`${metrics.globalSkillAverage}/4`} icon={ChartBarIcon} />
        <StatCard
          title="Taux de formation"
          value={`${metrics.trainingCompletionRate}%`}
          trend={`+${metrics.trainingCompletionRate}% des formations terminées`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-secondary">Niveau moyen par collaborateur</h3>
          <p className="mb-4 text-sm text-slate-500">
            Identifiez les équipes ayant le plus haut potentiel de compétences.
          </p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.skillsByUser}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis domain={[0, 4]} allowDecimals={false} stroke="#94a3b8" />
                <Tooltip cursor={{ fill: 'rgba(37,99,235,0.08)' }} />
                <Bar dataKey="averageSkill" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-secondary">Répartition des formations</h3>
          <p className="mb-4 text-sm text-slate-500">Analysez la progression globale des plans de formation.</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {statusData.map((status) => (
              <div key={status.name} className="flex items-center gap-2 text-sm text-slate-600">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }}></span>
                {status.name} ({status.value})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
