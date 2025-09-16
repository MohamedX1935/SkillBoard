import React, { useEffect, useMemo, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader.jsx';
import SearchInput from '../components/SearchInput.jsx';
import FilterSelect from '../components/FilterSelect.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { addTraining, deleteTraining, fetchTrainings, updateTraining } from '../services/trainingService.js';
import { fetchUsers } from '../services/userService.js';
import { trainingStatuses } from '../utils/constants.js';
import dayjs from 'dayjs';
import useAuth from '../hooks/useAuth.js';

const emptyTrainingForm = {
  userId: '',
  title: '',
  provider: '',
  status: 'Planifié',
  completionDate: '',
  notes: ''
};

const TrainingsPage = () => {
  const { user: currentUser } = useAuth();
  const [trainingRows, setTrainingRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyTrainingForm);
  const [editingTraining, setEditingTraining] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const [trainingsData, usersData] = await Promise.all([fetchTrainings(), fetchUsers()]);
      const rows = Array.isArray(trainingsData)
        ? trainingsData.map((training) => {
            const normalizedUserId =
              training.userId && typeof training.userId.toString === 'function'
                ? training.userId.toString()
                : training.userId;
            const normalizedTrainingId =
              training._id && typeof training._id.toString === 'function'
                ? training._id.toString()
                : training._id;
            return {
              ...training,
              id: normalizedTrainingId,
              userId: normalizedUserId,
              trainingId: normalizedTrainingId,
              userName: training.user,
              completionDate: training.completionDate ? dayjs(training.completionDate).format('YYYY-MM-DD') : ''
            };
          })
        : [];
      setTrainingRows(rows);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainings();
  }, []);

  const filteredRows = useMemo(() => {
    return trainingRows.filter((row) => {
      const matchesSearch = `${row.userName} ${row.title} ${row.provider}`.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter ? row.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [trainingRows, search, statusFilter]);

  const handleOpenModal = (training = null) => {
    setEditingTraining(training);
    setFormData(
      training
        ? {
            userId: training.userId,
            title: training.title,
            provider: training.provider || '',
            status: training.status,
            completionDate: training.completionDate || '',
            notes: training.notes || ''
          }
        : { ...emptyTrainingForm, userId: users[0]?._id || '' }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTraining(null);
    setFormData(emptyTrainingForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: formData.title,
        provider: formData.provider,
        status: formData.status,
        notes: formData.notes,
        completionDate: formData.completionDate ? dayjs(formData.completionDate).toDate() : undefined
      };
      if (editingTraining) {
        await updateTraining(formData.userId, editingTraining.trainingId, payload);
      } else {
        await addTraining(formData.userId, payload);
      }
      await loadTrainings();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (training) => {
    if (!window.confirm('Supprimer cette formation ?')) return;
    try {
      await deleteTraining(training.userId, training.trainingId);
      await loadTrainings();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'userName', header: 'Collaborateur' },
    { key: 'title', header: 'Formation' },
    { key: 'provider', header: 'Organisme' },
    {
      key: 'status',
      header: 'Statut',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'completionDate',
      header: 'Date',
      render: (value) => (value ? dayjs(value).format('DD/MM/YYYY') : '—')
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formations"
        description="Planifiez et suivez les actions de formation des équipes."
        actions={
          currentUser?.role === 'Admin'
            ? [
                <button
                  key="add"
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <PlusIcon className="h-5 w-5" /> Nouvelle formation
                </button>
              ]
            : undefined
        }
      />

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une formation" />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={trainingStatuses} placeholder="Filtrer par statut" />
          <button
            onClick={() => {
              setSearch('');
              setStatusFilter('');
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingOverlay message="Chargement des formations..." />
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredRows}
          renderActions={(row) =>
            currentUser?.role === 'Admin' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(row)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="rounded-lg border border-red-200 p-2 text-red-500 hover:bg-red-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ) : null
          }
        />
      )}

      <Modal
        open={isModalOpen}
        title={editingTraining ? 'Modifier la formation' : 'Nouvelle formation'}
        onClose={handleCloseModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-600">Collaborateur</label>
            <select
              required
              value={formData.userId}
              onChange={(event) => setFormData((prev) => ({ ...prev, userId: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Sélectionner un collaborateur</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600">Intitulé</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Organisme</label>
              <input
                type="text"
                value={formData.provider}
                onChange={(event) => setFormData((prev) => ({ ...prev, provider: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600">Statut</label>
              <select
                value={formData.status}
                onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {trainingStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Date de fin</label>
              <input
                type="date"
                value={formData.completionDate}
                onChange={(event) => setFormData((prev) => ({ ...prev, completionDate: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Notes</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrainingsPage;
