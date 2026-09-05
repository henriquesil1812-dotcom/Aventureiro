import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Shield, 
  UserCheck, 
  LogOut, 
  ChevronDown, 
  CheckCircle2, 
  LayoutDashboard, 
  Users, 
  Award, 
  FileCheck2, 
  CalendarClock, 
  Settings,
  Lock,
  FolderTree
} from 'lucide-react';

interface HeaderProps {
  currentTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab: propCurrentTab, onTabChange: propOnTabChange }) => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    logout, 
    isInstructor, 
    canEdit, 
    lastSavedAt,
    currentTab: contextCurrentTab,
    setCurrentTab,
    clubSettings
  } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentTab = propCurrentTab || contextCurrentTab || 'dashboard';
  const handleTabChange = (tab: string) => {
    if (propOnTabChange) {
      propOnTabChange(tab);
    } else if (setCurrentTab) {
      setCurrentTab(tab);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Painel Central', icon: LayoutDashboard },
    { id: 'adventurers', label: 'Aventureiros', icon: Users },
    { id: 'units', label: 'Unidades', icon: FolderTree },
    { id: 'specialties', label: 'Especialidades', icon: Award },
    { id: 'tests', label: 'Provas & Testes', icon: FileCheck2 },
    { id: 'schedule', label: 'Cronograma & Avisos', icon: CalendarClock },
    ...(isInstructor ? [{ id: 'admin', label: 'Administração', icon: Settings }] : []),
  ];

  return (
    <header className="sticky top-0 z-30 bg-purple-950/95 backdrop-blur-md border-b border-purple-800/60 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Club Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleTabChange('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-purple-950 font-bold shadow-md shadow-amber-500/20 border border-amber-300">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-950" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-300 rounded-full animate-ping opacity-75"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-xl tracking-tight text-white font-serif">
                  {clubSettings?.clubName || 'Herança do Céu'}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Aventureiros
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-purple-200/80 hidden xs:block">
                {clubSettings?.clubSubtitle || 'Painel Interno da Diretoria e Instrutores'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-purple-950 shadow-sm shadow-amber-500/30 font-semibold'
                      : 'text-purple-200 hover:text-white hover:bg-purple-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-950' : 'text-purple-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Auto-save Status */}
          <div className="flex items-center space-x-3">
            {/* Auto-save indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-purple-300/80 bg-purple-900/50 px-2.5 py-1 rounded-full border border-purple-800/50">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Salvo automaticamente</span>
            </div>

            {/* Current User Pill & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-purple-900/70 hover:bg-purple-800/80 border border-purple-700/50 transition-colors"
                title="Trocar de perfil ou sair"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400/60 bg-purple-950">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-amber-300">
                      {currentUser?.name.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white truncate max-w-[130px]">
                    {currentUser?.name}
                  </div>
                  <div className="flex items-center space-x-1 text-[10px]">
                    {currentUser?.role === 'INSTRUTOR' ? (
                      <span className="text-amber-300 font-medium flex items-center">
                        <Shield className="w-2.5 h-2.5 mr-0.5" /> Instrutor (Admin)
                      </span>
                    ) : currentUser?.canEdit ? (
                      <span className="text-emerald-300 font-medium flex items-center">
                        <UserCheck className="w-2.5 h-2.5 mr-0.5" /> Diretor (Edição)
                      </span>
                    ) : (
                      <span className="text-purple-300 flex items-center">
                        <Lock className="w-2.5 h-2.5 mr-0.5" /> Diretor (Leitura)
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-purple-300 ml-0.5" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 text-slate-800 p-3 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 mb-2">
                      <p className="text-xs font-medium text-slate-500">Conectado atualmente como:</p>
                      <p className="font-bold text-slate-900 text-sm">{currentUser?.name}</p>
                      <p className="text-xs text-purple-700 font-medium">{currentUser?.email}</p>
                      <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                        {currentUser?.role === 'INSTRUTOR'
                          ? 'Acesso Total (Instrutor / Admin)'
                          : currentUser?.canEdit
                          ? 'Diretor (Permissão de Edição Liberada)'
                          : 'Diretor (Modo Somente Leitura)'}
                      </div>
                    </div>

                    <div className="px-3 py-1">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                        Alternar perfil rápido:
                      </p>
                      <div className="space-y-1">
                        {users.map(u => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setShowUserMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              currentUser?.id === u.id
                                ? 'bg-purple-100 text-purple-900 font-semibold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            <span className="text-[10px] text-slate-500 ml-2">
                              {u.role === 'INSTRUTOR' ? 'Instrutor' : u.canEdit ? 'Dir. Edição' : 'Dir. Leitura'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Encerrar Sessão</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
