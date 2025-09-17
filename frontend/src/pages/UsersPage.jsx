import React, { useEffect, useMemo, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader.jsx';
import SearchInput from '../components/SearchInput.jsx';
import FilterSelect from '../components/FilterSelect.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import { createUser, deleteUser, fetchUsers, updateUser } from '../services/userService.js';
import useAuth from '../hooks/useAuth.js';

const defaultForm = {
  name: '',
  position: '',
  email: '',
  role: 'Utilisateur',
  password: ''
};

const roleOptions = ['Admin', 'Utilisateur'];

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadUsers = async (params = {}) => {
    try {
      setLoading(true);
      const data = await fetchUsers(params);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = `${user.name} ${user.email} ${user.position}`.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setFormData(
      user
        ? {
            name: user.name,
            position: user.position || '',
            email: user.email,
            role: user.role,
            password: ''
          }
        : defaultForm
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData(defaultForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const basePayload = {
        name: formData.name,
        position: formData.position,
        email: formData.email,
        role: formData.role
      };
      if (editingUser) {
        const payload = formData.password ? { ...basePayload, password: formData.password } : basePayload;
        await updateUser(editingUser._id, payload);
      } else {
        await createUser({ ...basePayload, password: formData.password });
      }
      await loadUsers();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await deleteUser(userId);
      await loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'name', header: 'Nom' },
    { key: 'position', header: 'Poste' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Rôle' },
    {
      key: 'skills',
      header: 'Compétences',
      render: (value = []) => `${value.length} suivies`
    },
    {
      key: 'trainings',
      header: 'Formations',
      render: (value = []) => `${value.length} inscrites`
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Gérez les comptes, les rôles et les accès à la plateforme."
        actions={
          currentUser?.role === 'Admin'
            ? [
                <button
                  key="add"
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <PlusIcon className="h-5 w-5" /> Nouvel utilisateur
                </button>
              ]
            : undefined
        }
      />

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un utilisateur" />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect value={roleFilter} onChange={setRoleFilter} options={roleOptions} placeholder="Filtrer par rôle" />
          <button
            onClick={() => {
              setSearch('');
              setRoleFilter('');
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingOverlay message="Chargement des utilisateurs..." />
      ) : error ? (
        <div className="rounded-2xl bg-red-50 p-6 text-red-600">{error}</div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredUsers}
          renderActions={(user) =>
            currentUser?.role === 'Admin' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(user)}
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
                >
                  <PencilSquareIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
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
        title={editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        onClose={handleCloseModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600">Nom</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Poste</label>
              <input
                type="text"
                value={formData.position}
                onChange={(event) => setFormData((prev) => ({ ...prev, position: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Rôle</label>
              <select
                value={formData.role}
                onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Mot de passe {editingUser && <span className="text-xs text-slate-400">(laisser vide pour conserver)</span>}</label>
            <input
              type="password"
              required={!editingUser}
              value={formData.password}
              onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
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

export default UsersPage;
