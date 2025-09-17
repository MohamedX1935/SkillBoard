import React, { useEffect, useMemo, useState } from 'react';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import PageHeader from '../components/PageHeader.jsx';
import SearchInput from '../components/SearchInput.jsx';
import FilterSelect from '../components/FilterSelect.jsx';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import LoadingOverlay from '../components/LoadingOverlay.jsx';
import { addSkill, deleteSkill, fetchSkills, updateSkill } from '../services/skillService.js';
import { fetchUsers } from '../services/userService.js';
import { skillLevels } from '../utils/constants.js';
import useAuth from '../hooks/useAuth.js';

const emptySkillForm = {
  userId: '',
  name: '',
  level: 'Débutant'
};

const SkillsPage = () => {
  const { user: currentUser } = useAuth();
  const [skillRows, setSkillRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptySkillForm);
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const [skillsData, usersData] = await Promise.all([fetchSkills(), fetchUsers()]);
      const rows = Array.isArray(skillsData)
        ? skillsData.flatMap((user) =>
            (user.skills || []).map((skill) => {
              const skillObj =
                skill && typeof skill === 'object' && typeof skill.toObject === 'function' ? skill.toObject() : skill;
              const normalizedSkillId =
                skillObj && skillObj._id && typeof skillObj._id.toString === 'function'
                  ? skillObj._id.toString()
                  : skillObj._id;
              const normalizedUserId =
                user._id && typeof user._id.toString === 'function' ? user._id.toString() : user._id;
              return {
                ...skillObj,
                id: normalizedSkillId,
                skillId: normalizedSkillId,
                userId: normalizedUserId,
                userName: user.name,
                userPosition: user.position
              };
            })
          )
        : [];
      setSkillRows(rows);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const filteredRows = useMemo(() => {
    return skillRows.filter((row) => {
      const matchesSearch = `${row.userName} ${row.name}`.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = levelFilter ? row.level === levelFilter : true;
      return matchesSearch && matchesLevel;
    });
  }, [skillRows, search, levelFilter]);

  const handleOpenModal = (skill = null) => {
    setEditingSkill(skill);
    setFormData(
      skill
        ? { userId: skill.userId, name: skill.name, level: skill.level }
        : { ...emptySkillForm, userId: users[0]?._id || '' }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData(emptySkillForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editingSkill) {
        await updateSkill(formData.userId, editingSkill.skillId, { name: formData.name, level: formData.level });
      } else {
        await addSkill(formData.userId, { name: formData.name, level: formData.level });
      }
      await loadSkills();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm('Supprimer cette compétence ?')) return;
    try {
      await deleteSkill(row.userId, row.skillId);
      await loadSkills();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'userName', header: 'Collaborateur' },
    { key: 'userPosition', header: 'Poste' },
    { key: 'name', header: 'Compétence' },
    { key: 'level', header: 'Niveau' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compétences"
        description="Associez des compétences à vos collaborateurs et suivez leur progression."
        actions={
          currentUser?.role === 'Admin'
            ? [
                <button
                  key="add"
                  onClick={() => handleOpenModal()}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <PlusIcon className="h-5 w-5" /> Nouvelle compétence
                </button>
              ]
            : undefined
        }
      />

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une compétence" />
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect value={levelFilter} onChange={setLevelFilter} options={skillLevels} placeholder="Filtrer par niveau" />
          <button
            onClick={() => {
              setSearch('');
              setLevelFilter('');
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingOverlay message="Chargement des compétences..." />
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
        title={editingSkill ? 'Modifier la compétence' : 'Nouvelle compétence'}
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
              <label className="text-sm font-medium text-slate-600">Compétence</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Niveau</label>
              <select
                value={formData.level}
                onChange={(event) => setFormData((prev) => ({ ...prev, level: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
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

export default SkillsPage;
