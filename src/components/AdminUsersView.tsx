import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, Unit } from '../types';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  History, 
  Users, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Download,
  X,
  Building2,
  BookmarkCheck,
  FolderTree,
  Edit2,
  Plus,
  Save,
  KeyRound,
  Camera
} from 'lucide-react';
import { formatDateTimeBR } from '../utils/formatters';
import { UnitsManagementView } from './UnitsManagementView';

export const AdminUsersView: React.FC = () => {
  const { 
    users, 
    currentUser, 
    isInstructor,
    addUser, 
    updateUser,
    deleteUser, 
    toggleUserCanEdit, 
    auditLogs, 
    resetToDemoData,
    clubSettings,
    updateClubSettings,
    units,
    addUnit,
    updateUnit,
    deleteUnit,
    specialtyCategories,
    addSpecialtyCategory,
    updateSpecialtyCategory,
    deleteSpecialtyCategory,
    clearSampleAdventurers,
    clearAllRecords,
    adventurers,
    earnedSpecialties,
    testRecords
  } = useApp();

  const [activeSubtab, setActiveSubtab] = useState<'users' | 'club' | 'units' | 'categories' | 'logs' | 'data'>('users');
  const [showNewUserModal, setShowNewUserModal] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('DIRETOR');
  const [newUserCanEdit, setNewUserCanEdit] = useState(false);

  // Club Settings state
  const [clubName, setClubName] = useState(clubSettings.clubName);
  const [clubSubtitle, setClubSubtitle] = useState(clubSettings.clubSubtitle);
  const [clubMotto, setClubMotto] = useState(clubSettings.clubMotto);
  const [associationDistrict, setAssociationDistrict] = useState(clubSettings.associationDistrict);
  const [foundingYear, setFoundingYear] = useState(clubSettings.foundingYear);
  const [clubSavedSuccess, setClubSavedSuccess] = useState(false);

  // Units management state
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [unitFormName, setUnitFormName] = useState('');
  const [unitFormCounselor, setUnitFormCounselor] = useState('');
  const [unitFormAgeRange, setUnitFormAgeRange] = useState('');
  const [unitFormSymbol, setUnitFormSymbol] = useState('');
  const [unitFormColor, setUnitFormColor] = useState('#7C3AED');
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);

  // Categories management state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryOld, setEditingCategoryOld] = useState<string | null>(null);
  const [editingCategoryNew, setEditingCategoryNew] = useState('');

  // Edit User state & photo
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('DIRETOR');
  const [editUserCanEdit, setEditUserCanEdit] = useState(false);
  const [editUserAvatar, setEditUserAvatar] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const userFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenEditUser = (user: any) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserRole(user.role);
    setEditUserCanEdit(user.canEdit);
    setEditUserAvatar(user.avatar || '');
    setEditUserPassword(user.password || '');
  };

  const handleUserPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A foto é muito grande. Escolha uma imagem com menos de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUserPhoto = () => {
    setEditUserAvatar('');
    if (userFileInputRef.current) {
      userFileInputRef.current.value = '';
    }
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!editUserName.trim()) {
      alert('O nome do usuário é obrigatório.');
      return;
    }

    updateUser(editingUser.id, {
      name: editUserName.trim(),
      role: editUserRole,
      canEdit: editUserRole === 'INSTRUTOR' ? true : editUserCanEdit,
      avatar: editUserAvatar || undefined,
      password: editUserPassword.trim() || undefined,
    });

    setEditingUser(null);
  };

  // Access check
  if (!isInstructor) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-sm max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-serif">Área Restrita ao Administrador</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Esta área é exclusiva para o Administrador (Instrutor). Seu perfil atual ({currentUser?.role}) não possui credenciais suficientes para alterar configurações globais do sistema.
        </p>
      </div>
    );
  }

  const handleSaveClubSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateClubSettings({
      clubName: clubName.trim() || 'Herança do Céu',
      clubSubtitle: clubSubtitle.trim(),
      clubMotto: clubMotto.trim(),
      associationDistrict: associationDistrict.trim(),
      foundingYear: foundingYear.trim(),
    });
    setClubSavedSuccess(true);
    setTimeout(() => setClubSavedSuccess(false), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      role: newUserRole,
      canEdit: newUserRole === 'INSTRUTOR' ? true : newUserCanEdit,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    });

    setNewUserName('');
    setNewUserEmail('');
    setShowNewUserModal(false);
  };

  const handleOpenEditUnit = (unit: Unit) => {
    setEditingUnitId(unit.id);
    setUnitFormName(unit.name);
    setUnitFormCounselor(unit.counselorName);
    setUnitFormAgeRange(unit.ageRange);
    setUnitFormSymbol(unit.symbol);
    setUnitFormColor(unit.color);
  };

  const handleSaveUnitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnitId) return;
    updateUnit(editingUnitId, {
      name: unitFormName.trim(),
      counselorName: unitFormCounselor.trim(),
      ageRange: unitFormAgeRange.trim(),
      symbol: unitFormSymbol.trim() || '🛡️',
      color: unitFormColor
    });
    setEditingUnitId(null);
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitFormName.trim()) return;
    addUnit({
      name: unitFormName.trim(),
      counselorName: unitFormCounselor.trim() || 'A definir',
      ageRange: unitFormAgeRange.trim() || '6 a 9 anos',
      symbol: unitFormSymbol.trim() || '🌟',
      color: unitFormColor
    });
    setUnitFormName('');
    setUnitFormCounselor('');
    setUnitFormAgeRange('');
    setShowNewUnitModal(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addSpecialtyCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleSaveRenameCategory = (oldName: string) => {
    if (!editingCategoryNew.trim()) return;
    updateSpecialtyCategory(oldName, editingCategoryNew.trim());
    setEditingCategoryOld(null);
    setEditingCategoryNew('');
  };

  const handleExportBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      clubSettings,
      users,
      units,
      specialtyCategories,
      adventurers,
      earnedSpecialties,
      testRecords,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_clube_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-[#1B0A33] text-white p-6 sm:p-7 rounded-3xl border border-purple-800/50 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Painel Geral do Administrador</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
              Administração & Configurações
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-xl">
              Personalize a identidade do clube, configure unidades e categorias, gerencie os logins da diretoria e audite o histórico.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewUserModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Novo Usuário</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600">
        <button
          onClick={() => setActiveSubtab('users')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubtab === 'users'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Usuários & Permissões ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubtab('club')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubtab === 'club'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Dados do Clube</span>
        </button>

        <button
          onClick={() => setActiveSubtab('units')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubtab === 'units'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>Unidades ({units.length})</span>
        </button>

        <button
          onClick={() => setActiveSubtab('categories')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubtab === 'categories'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Categorias ({specialtyCategories.length})</span>
        </button>

        <button
          onClick={() => setActiveSubtab('logs')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubtab === 'logs'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Trilha de Auditoria</span>
        </button>

        <button
          onClick={() => setActiveSubtab('data')}
          className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubtab === 'data'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Backup & Limpeza</span>
        </button>
      </div>

      {/* SUBTAB 1: USUÁRIOS E PERMISSÕES */}
      {activeSubtab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900 font-serif">Equipe de Liderança</h3>
                <p className="text-xs text-slate-500">
                  Gerencie o acesso e conceda ou revogue a autorização de edição para Diretores.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {users.map(u => {
                const isHenrique = u.email.toLowerCase() === 'henriquesil1812@gmail.com';
                const isCurrentLogged = currentUser?.id === u.id;

                return (
                  <div 
                    key={u.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isHenrique 
                        ? 'bg-amber-50/70 border-amber-300 shadow-sm' 
                        : 'bg-slate-50 border-slate-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img 
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                        alt={u.name} 
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">{u.name}</h4>
                          {isCurrentLogged && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                              Você
                            </span>
                          )}
                          {isHenrique && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-purple-950 uppercase">
                              Admin Master
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-mono">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            u.role === 'INSTRUTOR' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role === 'INSTRUTOR' ? 'Instrutor (Admin)' : 'Diretor(a)'}
                          </span>
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                            u.password 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {u.password ? 'Senha Definida' : 'Primeiro Acesso Pendente'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      {u.role !== 'INSTRUTOR' ? (
                        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                          <span className="text-xs text-slate-600 font-medium">Permitir Edição:</span>
                          <button
                            type="button"
                            onClick={() => toggleUserCanEdit(u.id, !u.canEdit)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                              u.canEdit 
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {u.canEdit ? 'Liberada' : 'Bloqueada'}
                          </button>
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 text-xs font-bold border border-purple-200">
                          Acesso Total Irrestrito
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEditUser(u)}
                        className="px-2.5 py-1.5 text-purple-700 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer flex items-center space-x-1 border border-purple-200"
                        title="Editar dados cadastrais e trocar foto"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-purple-700" />
                        <span className="text-xs font-bold text-purple-900">Editar</span>
                      </button>

                      {!isHenrique && users.length > 1 && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Deseja realmente remover o login de ${u.name}?`)) {
                              deleteUser(u.id);
                            }
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Excluir Usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DADOS DO CLUBE */}
      {activeSubtab === 'club' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-7 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 font-serif">Identidade Oficial do Clube</h3>
            <p className="text-xs text-slate-500">
              Esses dados são refletidos no topo do aplicativo, cabeçalhos de impressão e na tela de login.
            </p>
          </div>

          {clubSavedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Configurações do clube atualizadas com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleSaveClubSettings} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome Oficial do Clube</label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="ex: Herança do Céu"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subtítulo / Descrição Curta</label>
              <input
                type="text"
                value={clubSubtitle}
                onChange={(e) => setClubSubtitle(e.target.value)}
                placeholder="ex: Clube de Aventureiros • Painel da Liderança"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lema do Clube</label>
              <input
                type="text"
                value={clubMotto}
                onChange={(e) => setClubMotto(e.target.value)}
                placeholder="ex: Por amor a Jesus, farei sempre o meu melhor!"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Associação / Distrito</label>
                <input
                  type="text"
                  value={associationDistrict}
                  onChange={(e) => setAssociationDistrict(e.target.value)}
                  placeholder="ex: Associação Paulistana • 4ª Região"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ano de Fundação</label>
                <input
                  type="text"
                  value={foundingYear}
                  onChange={(e) => setFoundingYear(e.target.value)}
                  placeholder="ex: 2018"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors flex items-center space-x-1.5 shadow-md shadow-purple-900/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Dados do Clube</span>
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 3: UNIDADES */}
      {activeSubtab === 'units' && (
        <div className="pt-2">
          <UnitsManagementView />
        </div>
      )}

      {/* SUBTAB 4: CATEGORIAS DE ESPECIALIDADES */}
      {activeSubtab === 'categories' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-7 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 font-serif">Categorias de Especialidades</h3>
            <p className="text-xs text-slate-500">
              Adicione, renomeie ou remova as categorias oficiais usadas para classificar especialidades.
            </p>
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da nova categoria..."
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors flex items-center space-x-1 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar</span>
            </button>
          </form>

          {/* Categories List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {specialtyCategories.map(cat => (
              <div 
                key={cat} 
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
              >
                {editingCategoryOld === cat ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      value={editingCategoryNew}
                      onChange={(e) => setEditingCategoryNew(e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-white rounded border border-purple-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveRenameCategory(cat)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCategoryOld(null)}
                      className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-bold text-slate-800">{cat}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategoryOld(cat);
                          setEditingCategoryNew(cat);
                        }}
                        className="p-1 text-slate-400 hover:text-purple-700 transition-colors"
                        title="Renomear"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Deseja remover a categoria "${cat}"?`)) {
                            deleteSpecialtyCategory(cat);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: TRILHA DE AUDITORIA */}
      {activeSubtab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-serif flex items-center space-x-2">
                <History className="w-4 h-4 text-purple-700" />
                <span>Trilha de Auditoria e Transparência</span>
              </h3>
              <p className="text-xs text-slate-500">
                Registro automático de quem alterou o quê e em qual momento
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {auditLogs.length} registros
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      {log.userRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{log.details}</p>
                  <p className="text-[11px] text-slate-400">
                    Realizado por: <strong className="text-slate-700">{log.userName}</strong>
                  </p>
                </div>

                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap self-end sm:self-auto">
                  {formatDateTimeBR(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 6: SEGURANÇA, BACKUP E LIMPEZA */}
      {activeSubtab === 'data' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-serif">Segurança, Backup e Limpeza de Dados</h3>
            <p className="text-xs text-slate-500">
              Gerencie a base de dados do clube. Você pode exportar backups ou limpar dados de teste para começar com uma base limpa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Backup */}
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-purple-950">Exportar Backup Completo (JSON)</h4>
                <p className="text-xs text-purple-800/80 leading-relaxed">
                  Baixe um arquivo seguro com todos os aventureiros, especialidades, notas e configurações.
                </p>
              </div>
              <button
                onClick={handleExportBackup}
                className="mt-3 px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors flex items-center space-x-1.5 cursor-pointer w-full justify-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar Backup</span>
              </button>
            </div>

            {/* Clear Sample Data */}
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-rose-950">Limpar Dados de Demonstração</h4>
                <p className="text-xs text-rose-800/80 leading-relaxed">
                  Remove todos os aventureiros e notas de teste fictícios para que você possa cadastrar os membros reais do seu clube.
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Atenção: Isso irá remover os aventureiros e lançamentos fictícios para você começar com a lista limpa. Deseja continuar?')) {
                    clearSampleAdventurers();
                    alert('Dados de demonstração removidos com sucesso! Você pode cadastrar seus aventureiros agora.');
                  }
                }}
                className="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors flex items-center space-x-1.5 cursor-pointer w-full justify-center"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar Aventureiros Fictícios</span>
              </button>
            </div>

            {/* Restore Demo */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-amber-950">Restaurar Base Padrão</h4>
                <p className="text-xs text-amber-800/80 leading-relaxed">
                  Volta o sistema para o estado inicial com as especialidades e aventureiros modelo.
                </p>
              </div>
              <button
                onClick={resetToDemoData}
                className="mt-3 px-4 py-2 rounded-xl bg-amber-500 text-purple-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center space-x-1.5 cursor-pointer w-full justify-center"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NEW USER MODAL */}
      {showNewUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setShowNewUserModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <UserPlus className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-serif">Criar Novo Login de Acesso</h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  placeholder="ex: Tatiana Alencar"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email de Acesso</label>
                <input
                  type="email"
                  placeholder="ex: tatiana@heranca.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo / Função</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                >
                  <option value="DIRETOR">Diretoria (Diretor / Diretor Associado)</option>
                  <option value="INSTRUTOR">Instrutor (Acesso de Administração)</option>
                </select>
              </div>

              {newUserRole === 'DIRETOR' && (
                <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="newCanEdit"
                    checked={newUserCanEdit}
                    onChange={(e) => setNewUserCanEdit(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <label htmlFor="newCanEdit" className="text-xs text-slate-700">
                    Conceder permissão imediata de edição (lançar notas e especialidades)
                  </label>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors shadow-md mt-2 cursor-pointer"
              >
                Cadastrar Usuário
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT UNIT MODAL */}
      {editingUnitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setEditingUnitId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg font-serif mb-4 text-purple-950">Editar Unidade</h3>

            <form onSubmit={handleSaveUnitEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Unidade</label>
                <input
                  type="text"
                  value={unitFormName}
                  onChange={(e) => setUnitFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conselheiro(a) Responsável</label>
                <input
                  type="text"
                  value={unitFormCounselor}
                  onChange={(e) => setUnitFormCounselor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faixa Etária / Descrição</label>
                <input
                  type="text"
                  value={unitFormAgeRange}
                  onChange={(e) => setUnitFormAgeRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emoji / Símbolo</label>
                  <input
                    type="text"
                    value={unitFormSymbol}
                    onChange={(e) => setUnitFormSymbol(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cor da Unidade</label>
                  <input
                    type="color"
                    value={unitFormColor}
                    onChange={(e) => setUnitFormColor(e.target.value)}
                    className="w-full h-9 p-1 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors shadow-md mt-2 cursor-pointer"
              >
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW UNIT MODAL */}
      {showNewUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setShowNewUnitModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg font-serif mb-4 text-purple-950">Cadastrar Nova Unidade</h3>

            <form onSubmit={handleCreateUnit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Unidade</label>
                <input
                  type="text"
                  placeholder="ex: Guardiões da Fé"
                  value={unitFormName}
                  onChange={(e) => setUnitFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Conselheiro(a) Responsável</label>
                <input
                  type="text"
                  placeholder="ex: Lucas Martins"
                  value={unitFormCounselor}
                  onChange={(e) => setUnitFormCounselor(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Faixa Etária</label>
                <input
                  type="text"
                  placeholder="ex: 7 a 8 anos"
                  value={unitFormAgeRange}
                  onChange={(e) => setUnitFormAgeRange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emoji / Símbolo</label>
                  <input
                    type="text"
                    placeholder="ex: 🛡️"
                    value={unitFormSymbol}
                    onChange={(e) => setUnitFormSymbol(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cor</label>
                  <input
                    type="color"
                    value={unitFormColor}
                    onChange={(e) => setUnitFormColor(e.target.value)}
                    className="w-full h-9 p-1 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors shadow-md mt-2 cursor-pointer"
              >
                Criar Unidade
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL WITH PHOTO MANAGEMENT */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-5 pb-3 border-b border-slate-100">
              <div className="p-2 bg-purple-100 text-purple-900 rounded-xl">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base font-serif text-slate-900">Editar Usuário</h3>
                <p className="text-xs text-slate-500">{editingUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              {/* Photo / Avatar Section */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-200 shadow-md bg-purple-950 flex items-center justify-center">
                  {editUserAvatar ? (
                    <img src={editUserAvatar} alt={editUserName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-2xl font-black text-amber-300">
                      {editUserName ? editUserName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={userFileInputRef}
                    onChange={handleUserPhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => userFileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{editUserAvatar ? 'Alterar Foto' : 'Adicionar Foto'}</span>
                  </button>

                  {editUserAvatar && (
                    <button
                      type="button"
                      onClick={handleRemoveUserPhoto}
                      className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center space-x-1 border border-rose-200 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Foto</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">Formato JPG ou PNG (máximo 5MB)</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Função / Cargo</label>
                  <select
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                    disabled={editingUser.email.toLowerCase() === 'henriquesil1812@gmail.com'}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 disabled:opacity-60"
                  >
                    <option value="DIRETOR">Diretor(a)</option>
                    <option value="INSTRUTOR">Instrutor (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Permissão de Edição</label>
                  <select
                    value={editUserRole === 'INSTRUTOR' ? 'true' : (editUserCanEdit ? 'true' : 'false')}
                    onChange={(e) => setEditUserCanEdit(e.target.value === 'true')}
                    disabled={editUserRole === 'INSTRUTOR'}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600 disabled:opacity-60"
                  >
                    <option value="true">Liberada (Pode editar)</option>
                    <option value="false">Bloqueada (Somente leitura)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Redefinir Senha de Acesso (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Deixe em branco para manter a senha atual"
                  value={editUserPassword}
                  onChange={(e) => setEditUserPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
