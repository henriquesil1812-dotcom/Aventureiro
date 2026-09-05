import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Unit, 
  Adventurer, 
  CatalogSpecialty, 
  EarnedSpecialty, 
  TestRecord, 
  ClassRequirement,
  ScheduleItem, 
  ReminderNotice, 
  AuditLogEntry,
  AdventurerClass,
  ClubSettings
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_UNITS,
  INITIAL_SPECIALTIES_CATALOG,
  INITIAL_CLASS_REQUIREMENTS,
  INITIAL_ADVENTURERS,
  INITIAL_EARNED_SPECIALTIES,
  INITIAL_TEST_RECORDS,
  INITIAL_CLASS_PROGRESS,
  INITIAL_SCHEDULE_ITEMS,
  INITIAL_REMINDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CLUB_SETTINGS,
  INITIAL_SPECIALTY_CATEGORIES
} from '../data/initialData';

const STORAGE_KEY = 'heranca_do_ceu_store_v1';
const AUTH_KEY = 'heranca_do_ceu_auth_user_id';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  units: Unit[];
  adventurers: Adventurer[];
  specialtiesCatalog: CatalogSpecialty[];
  earnedSpecialties: EarnedSpecialty[];
  testRecords: TestRecord[];
  classRequirements: ClassRequirement[];
  classProgress: Record<string, string[]>;
  scheduleItems: ScheduleItem[];
  reminders: ReminderNotice[];
  auditLogs: AuditLogEntry[];
  clubSettings: ClubSettings;
  specialtyCategories: string[];
  canEdit: boolean;
  isInstructor: boolean;
  lastSavedAt: Date | null;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  
  // Auth methods
  login: (email: string, passwordAttempt?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  requestPasswordReset: (email: string) => { success: boolean; code: string; hasExistingPassword: boolean };
  setUserPassword: (email: string, newPassword: string) => boolean;

  // Club & System customization (Admin only)
  updateClubSettings: (settings: Partial<ClubSettings>) => void;
  addSpecialtyCategory: (name: string) => void;
  updateSpecialtyCategory: (oldName: string, newName: string) => void;
  deleteSpecialtyCategory: (name: string) => void;

  // Adventurer methods
  addAdventurer: (adventurer: Omit<Adventurer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAdventurer: (id: string, updates: Partial<Adventurer>) => void;
  deleteAdventurer: (id: string) => void;

  // Unit methods
  addUnit: (unit: Omit<Unit, 'id'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;

  // Specialty methods
  addEarnedSpecialty: (data: Omit<EarnedSpecialty, 'id'>) => void;
  updateEarnedSpecialty: (id: string, updates: Partial<EarnedSpecialty>) => void;
  deleteEarnedSpecialty: (id: string) => void;
  addCatalogSpecialty: (data: Omit<CatalogSpecialty, 'id'>) => void;
  updateCatalogSpecialty: (id: string, updates: Partial<CatalogSpecialty>) => void;
  deleteCatalogSpecialty: (id: string) => void;

  // Test methods
  addTestRecord: (data: Omit<TestRecord, 'id'>) => void;
  updateTestRecord: (id: string, updates: Partial<TestRecord>) => void;
  deleteTestRecord: (id: string) => void;

  // Class Progress methods
  toggleRequirement: (adventurerId: string, requirementId: string) => void;

  // Schedule methods
  addScheduleItem: (data: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;

  // Reminder methods
  addReminder: (data: Omit<ReminderNotice, 'id' | 'createdAt'>) => void;
  updateReminder: (id: string, updates: Partial<ReminderNotice>) => void;
  deleteReminder: (id: string) => void;

  // User Administration
  addUser: (data: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserCanEdit: (userId: string, canEdit: boolean) => void;

  // Data utils & Admin Cleanup
  resetToDemoData: () => void;
  clearSampleAdventurers: () => void;
  clearAllRecords: () => void;
  logAction: (action: string, details: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialize with demo data
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
      let list: User[] = saved ? JSON.parse(saved) : INITIAL_USERS;
      // Ensure Henrique admin user is ALWAYS present
      const henriqueInInitial = INITIAL_USERS.find(u => u.email === 'henriquesil1812@gmail.com');
      if (henriqueInInitial && !list.some(u => u.email.toLowerCase() === 'henriquesil1812@gmail.com')) {
        list = [henriqueInInitial, ...list];
        localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(list));
      }
      return list;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUserId = localStorage.getItem(AUTH_KEY);
      if (savedUserId) {
        const found = users.find(u => u.id === savedUserId);
        if (found) return found;
      }
      // Prioritize Henrique admin user if available
      const henrique = users.find(u => u.email.toLowerCase() === 'henriquesil1812@gmail.com');
      return henrique || users[0] || null;
    } catch {
      return users[0] || null;
    }
  });

  const [clubSettings, setClubSettings] = useState<ClubSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clubSettings`);
      return saved ? JSON.parse(saved) : INITIAL_CLUB_SETTINGS;
    } catch {
      return INITIAL_CLUB_SETTINGS;
    }
  });

  const [specialtyCategories, setSpecialtyCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_specialtyCategories`);
      return saved ? JSON.parse(saved) : INITIAL_SPECIALTY_CATEGORIES;
    } catch {
      return INITIAL_SPECIALTY_CATEGORIES;
    }
  });

  const [units, setUnits] = useState<Unit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_units`);
      return saved ? JSON.parse(saved) : INITIAL_UNITS;
    } catch {
      return INITIAL_UNITS;
    }
  });

  const [adventurers, setAdventurers] = useState<Adventurer[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_adventurers`);
      return saved ? JSON.parse(saved) : INITIAL_ADVENTURERS;
    } catch {
      return INITIAL_ADVENTURERS;
    }
  });

  const [specialtiesCatalog, setSpecialtiesCatalog] = useState<CatalogSpecialty[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_specialtiesCatalog`);
      return saved ? JSON.parse(saved) : INITIAL_SPECIALTIES_CATALOG;
    } catch {
      return INITIAL_SPECIALTIES_CATALOG;
    }
  });

  const [earnedSpecialties, setEarnedSpecialties] = useState<EarnedSpecialty[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_earnedSpecialties`);
      return saved ? JSON.parse(saved) : INITIAL_EARNED_SPECIALTIES;
    } catch {
      return INITIAL_EARNED_SPECIALTIES;
    }
  });

  const [testRecords, setTestRecords] = useState<TestRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_testRecords`);
      return saved ? JSON.parse(saved) : INITIAL_TEST_RECORDS;
    } catch {
      return INITIAL_TEST_RECORDS;
    }
  });

  const [classRequirements] = useState<ClassRequirement[]>(INITIAL_CLASS_REQUIREMENTS);

  const [classProgress, setClassProgress] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_classProgress`);
      return saved ? JSON.parse(saved) : INITIAL_CLASS_PROGRESS;
    } catch {
      return INITIAL_CLASS_PROGRESS;
    }
  });

  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_scheduleItems`);
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE_ITEMS;
    } catch {
      return INITIAL_SCHEDULE_ITEMS;
    }
  });

  const [reminders, setReminders] = useState<ReminderNotice[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_reminders`);
      return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
    } catch {
      return INITIAL_REMINDERS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_auditLogs`);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(new Date());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Automatic saving whenever any core entity changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_units`, JSON.stringify(units));
      localStorage.setItem(`${STORAGE_KEY}_adventurers`, JSON.stringify(adventurers));
      localStorage.setItem(`${STORAGE_KEY}_specialtiesCatalog`, JSON.stringify(specialtiesCatalog));
      localStorage.setItem(`${STORAGE_KEY}_earnedSpecialties`, JSON.stringify(earnedSpecialties));
      localStorage.setItem(`${STORAGE_KEY}_testRecords`, JSON.stringify(testRecords));
      localStorage.setItem(`${STORAGE_KEY}_classProgress`, JSON.stringify(classProgress));
      localStorage.setItem(`${STORAGE_KEY}_scheduleItems`, JSON.stringify(scheduleItems));
      localStorage.setItem(`${STORAGE_KEY}_reminders`, JSON.stringify(reminders));
      localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_clubSettings`, JSON.stringify(clubSettings));
      localStorage.setItem(`${STORAGE_KEY}_specialtyCategories`, JSON.stringify(specialtyCategories));
      setLastSavedAt(new Date());
    } catch (e) {
      console.warn('Auto-save error', e);
    }
  }, [
    users, 
    units, 
    adventurers, 
    specialtiesCatalog, 
    earnedSpecialties, 
    testRecords, 
    classProgress, 
    scheduleItems, 
    reminders, 
    auditLogs,
    clubSettings,
    specialtyCategories
  ]);

  // Sync current user if users array changed (e.g. permission toggled)
  useEffect(() => {
    if (currentUser) {
      const updated = users.find(u => u.id === currentUser.id);
      if (updated && (updated.canEdit !== currentUser.canEdit || updated.role !== currentUser.role)) {
        setCurrentUser(updated);
      }
    }
  }, [users, currentUser]);

  const logAction = useCallback((action: string, details: string) => {
    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      userId: currentUser ? currentUser.id : 'sistema',
      userName: currentUser ? currentUser.name : 'Sistema',
      userRole: currentUser ? currentUser.role : 'INSTRUTOR',
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  // Auth
  const login = useCallback((email: string, passwordAttempt?: string): boolean => {
    const normalized = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === normalized);
    if (found) {
      if (found.password && passwordAttempt && found.password !== passwordAttempt) {
        return false;
      }
      setCurrentUser(found);
      localStorage.setItem(AUTH_KEY, found.id);
      logAction('Login', `Usuário ${found.name} acessou o sistema.`);
      return true;
    }
    return false;
  }, [users, logAction]);

  const logout = useCallback(() => {
    if (currentUser) {
      logAction('Logout', `Usuário ${currentUser.name} saiu do sistema.`);
    }
    setCurrentUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, [currentUser, logAction]);

  const switchUser = useCallback((userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(AUTH_KEY, found.id);
      logAction('Troca de Perfil', `Alternou para o perfil de ${found.name} (${found.role}).`);
    }
  }, [users, logAction]);

  const requestPasswordReset = useCallback((email: string): { success: boolean; code: string; hasExistingPassword: boolean } => {
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found) {
      return { success: false, code: '', hasExistingPassword: false };
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    logAction('Recuperação de Senha', `Código de verificação gerado para ${found.email}.`);
    return {
      success: true,
      code,
      hasExistingPassword: !!found.password
    };
  }, [users, logAction]);

  const setUserPassword = useCallback((email: string, newPassword: string): boolean => {
    const normalized = email.trim().toLowerCase();
    const target = users.find(u => u.email.toLowerCase() === normalized);
    if (!target) return false;

    setUsers(prev => prev.map(u => u.email.toLowerCase() === normalized ? { ...u, password: newPassword } : u));
    if (currentUser && currentUser.email.toLowerCase() === normalized) {
      setCurrentUser(prev => prev ? { ...prev, password: newPassword } : null);
    }
    logAction('Senha Definida', `Senha cadastrada/atualizada com sucesso para ${target.name}.`);
    return true;
  }, [users, currentUser, logAction]);

  // Club & System customization (Admin only)
  const updateClubSettings = useCallback((updates: Partial<ClubSettings>) => {
    setClubSettings(prev => ({ ...prev, ...updates }));
    logAction('Configuração do Clube', 'Atualizou informações e textos gerais do clube.');
  }, [logAction]);

  const addSpecialtyCategory = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSpecialtyCategories(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    logAction('Nova Categoria', `Adicionou categoria de especialidades: ${trimmed}`);
  }, [logAction]);

  const updateSpecialtyCategory = useCallback((oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew || oldName === trimmedNew) return;
    setSpecialtyCategories(prev => prev.map(c => c === oldName ? trimmedNew : c));
    setSpecialtiesCatalog(prev => prev.map(s => s.category === oldName ? { ...s, category: trimmedNew } : s));
    setEarnedSpecialties(prev => prev.map(e => e.category === oldName ? { ...e, category: trimmedNew } : e));
    logAction('Renomear Categoria', `Renomeou categoria "${oldName}" para "${trimmedNew}".`);
  }, [logAction]);

  const deleteSpecialtyCategory = useCallback((name: string) => {
    setSpecialtyCategories(prev => prev.filter(c => c !== name));
    logAction('Excluiu Categoria', `Removeu categoria de especialidade: ${name}`);
  }, [logAction]);

  // Computed permissions
  const isInstructor = currentUser?.role === 'INSTRUTOR';
  const canEdit = isInstructor || (currentUser?.role === 'DIRETOR' && !!currentUser?.canEdit);

  // Adventurer Actions
  const addAdventurer = useCallback((data: Omit<Adventurer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAdv: Adventurer = {
      ...data,
      id: 'adv-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setAdventurers(prev => [newAdv, ...prev]);
    // Initialize class progress with empty
    setClassProgress(prev => ({ ...prev, [newAdv.id]: [] }));
    logAction('Novo Aventureiro', `Cadastrou o aventureiro ${newAdv.name} na classe ${newAdv.currentClass}.`);
  }, [logAction]);

  const updateAdventurer = useCallback((id: string, updates: Partial<Adventurer>) => {
    setAdventurers(prev => prev.map(a => {
      if (a.id === id) {
        const updated = { ...a, ...updates, updatedAt: new Date().toISOString() };
        logAction('Editou Aventureiro', `Atualizou dados do aventureiro ${updated.name}.`);
        return updated;
      }
      return a;
    }));
  }, [logAction]);

  const deleteAdventurer = useCallback((id: string) => {
    const target = adventurers.find(a => a.id === id);
    if (!target) return;
    setAdventurers(prev => prev.filter(a => a.id !== id));
    setEarnedSpecialties(prev => prev.filter(e => e.adventurerId !== id));
    setTestRecords(prev => prev.filter(t => t.adventurerId !== id));
    logAction('Excluiu Aventureiro', `Removeu o cadastro de ${target.name}.`);
  }, [adventurers, logAction]);

  // Unit Actions
  const addUnit = useCallback((unitData: Omit<Unit, 'id'>) => {
    const newUnit: Unit = {
      ...unitData,
      id: 'unit-' + Date.now(),
    };
    setUnits(prev => [...prev, newUnit]);
    logAction('Nova Unidade', `Criou a unidade ${newUnit.name}.`);
  }, [logAction]);

  const updateUnit = useCallback((id: string, updates: Partial<Unit>) => {
    setUnits(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updates };
        logAction('Editou Unidade', `Atualizou os dados da unidade ${updated.name}.`);
        return updated;
      }
      return u;
    }));
  }, [logAction]);

  const deleteUnit = useCallback((id: string) => {
    const target = units.find(u => u.id === id);
    if (!target) return;
    setUnits(prev => prev.filter(u => u.id !== id));
    // Cleanly reassign adventurers in this unit to prevent invalid state
    setAdventurers(prev => prev.map(a => a.unitId === id ? { ...a, unitId: '' } : a));
    logAction('Excluiu Unidade', `Removeu a unidade ${target.name}.`);
  }, [units, logAction]);

  // Specialty Actions
  const addEarnedSpecialty = useCallback((data: Omit<EarnedSpecialty, 'id'>) => {
    const newEarned: EarnedSpecialty = {
      ...data,
      id: 'earned-' + Date.now(),
    };
    const adv = adventurers.find(a => a.id === data.adventurerId);
    setEarnedSpecialties(prev => [newEarned, ...prev]);
    logAction('Lançou Especialidade', `Registrou especialidade "${data.specialtyName}" para ${adv ? adv.name : 'aventureiro'} (Avaliador: ${data.instructorName}).`);
  }, [adventurers, logAction]);

  const updateEarnedSpecialty = useCallback((id: string, updates: Partial<EarnedSpecialty>) => {
    setEarnedSpecialties(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, ...updates };
        logAction('Editou Especialidade Conquistada', `Atualizou especialidade "${updated.specialtyName}".`);
        return updated;
      }
      return e;
    }));
  }, [logAction]);

  const deleteEarnedSpecialty = useCallback((id: string) => {
    const target = earnedSpecialties.find(e => e.id === id);
    if (!target) return;
    setEarnedSpecialties(prev => prev.filter(e => e.id !== id));
    logAction('Removeu Especialidade', `Removeu o registro da especialidade "${target.specialtyName}".`);
  }, [earnedSpecialties, logAction]);

  const addCatalogSpecialty = useCallback((data: Omit<CatalogSpecialty, 'id'>) => {
    const newSpec: CatalogSpecialty = {
      ...data,
      id: 'spec-' + Date.now(),
    };
    setSpecialtiesCatalog(prev => [...prev, newSpec]);
    logAction('Cadastrou Especialidade no Catálogo', `Adicionou "${newSpec.name}" à categoria ${newSpec.category}.`);
  }, [logAction]);

  const updateCatalogSpecialty = useCallback((id: string, updates: Partial<CatalogSpecialty>) => {
    setSpecialtiesCatalog(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        logAction('Editou Especialidade do Catálogo', `Atualizou especialidade "${updated.name}".`);
        return updated;
      }
      return s;
    }));
  }, [logAction]);

  const deleteCatalogSpecialty = useCallback((id: string) => {
    const target = specialtiesCatalog.find(s => s.id === id);
    if (!target) return;
    setSpecialtiesCatalog(prev => prev.filter(s => s.id !== id));
    logAction('Excluiu Especialidade do Catálogo', `Removeu especialidade "${target.name}".`);
  }, [specialtiesCatalog, logAction]);

  // Test Actions
  const addTestRecord = useCallback((data: Omit<TestRecord, 'id'>) => {
    const newRecord: TestRecord = {
      ...data,
      id: 'test-' + Date.now(),
    };
    const adv = adventurers.find(a => a.id === data.adventurerId);
    setTestRecords(prev => [newRecord, ...prev]);
    logAction('Registrou Prova', `Lançou prova "${data.testName}" para ${adv ? adv.name : 'aventureiro'} (Resultado: ${data.status || data.numericScore}).`);
  }, [adventurers, logAction]);

  const updateTestRecord = useCallback((id: string, updates: Partial<TestRecord>) => {
    setTestRecords(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, ...updates };
        logAction('Editou Registro de Prova', `Atualizou prova "${updated.testName}".`);
        return updated;
      }
      return t;
    }));
  }, [logAction]);

  const deleteTestRecord = useCallback((id: string) => {
    const target = testRecords.find(t => t.id === id);
    if (!target) return;
    setTestRecords(prev => prev.filter(t => t.id !== id));
    logAction('Excluiu Prova', `Removeu o registro da prova "${target.testName}".`);
  }, [testRecords, logAction]);

  // Class Requirement Toggle
  const toggleRequirement = useCallback((adventurerId: string, requirementId: string) => {
    setClassProgress(prev => {
      const current = prev[adventurerId] || [];
      const exists = current.includes(requirementId);
      const updated = exists 
        ? current.filter(id => id !== requirementId)
        : [...current, requirementId];
      
      const adv = adventurers.find(a => a.id === adventurerId);
      const req = classRequirements.find(r => r.id === requirementId);
      logAction('Atualizou Requisito', `${exists ? 'Desmarcou' : 'Concluiu'} requisito "${req?.title}" para ${adv?.name || 'aventureiro'}.`);

      return {
        ...prev,
        [adventurerId]: updated
      };
    });
  }, [adventurers, classRequirements, logAction]);

  // Schedule Actions
  const addScheduleItem = useCallback((data: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...data,
      id: 'sched-' + Date.now(),
    };
    setScheduleItems(prev => [...prev, newItem].sort((a, b) => a.plannedDate.localeCompare(b.plannedDate)));
    logAction('Novo Agendamento', `Adicionou ao cronograma: "${newItem.specialtyName}" em ${newItem.plannedDate}.`);
  }, [logAction]);

  const updateScheduleItem = useCallback((id: string, updates: Partial<ScheduleItem>) => {
    setScheduleItems(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...updates };
        logAction('Editou Cronograma', `Atualizou evento "${updated.specialtyName}".`);
        return updated;
      }
      return s;
    }));
  }, [logAction]);

  const deleteScheduleItem = useCallback((id: string) => {
    const target = scheduleItems.find(s => s.id === id);
    if (!target) return;
    setScheduleItems(prev => prev.filter(s => s.id !== id));
    logAction('Excluiu do Cronograma', `Removeu evento "${target.specialtyName}".`);
  }, [scheduleItems, logAction]);

  // Reminder Actions
  const addReminder = useCallback((data: Omit<ReminderNotice, 'id' | 'createdAt'>) => {
    const newNotice: ReminderNotice = {
      ...data,
      id: 'rem-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setReminders(prev => [newNotice, ...prev]);
    logAction('Criou Lembrete WhatsApp', `Gerou aviso para atividade: "${data.activity}".`);
  }, [logAction]);

  const updateReminder = useCallback((id: string, updates: Partial<ReminderNotice>) => {
    setReminders(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...updates };
        logAction('Editou Lembrete WhatsApp', `Atualizou aviso da atividade: "${updated.activity}".`);
        return updated;
      }
      return r;
    }));
  }, [logAction]);

  const deleteReminder = useCallback((id: string) => {
    const target = reminders.find(r => r.id === id);
    if (!target) return;
    setReminders(prev => prev.filter(r => r.id !== id));
    logAction('Excluiu Lembrete', `Removeu comunicado de "${target.activity}".`);
  }, [reminders, logAction]);

  // User Administration
  const addUser = useCallback((data: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...data,
      id: 'user-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    logAction('Criou Usuário', `Cadastrou novo login para ${newUser.name} (${newUser.role}).`);
  }, [logAction]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const updated = { ...u, ...updates };
        logAction('Editou Usuário', `Atualizou dados do usuário ${updated.name}.`);
        return updated;
      }
      return u;
    }));
    if (currentUser?.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [currentUser, logAction]);

  const deleteUser = useCallback((id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    if (users.length <= 1) {
      alert('Não é possível remover o único usuário do sistema.');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== id));
    logAction('Excluiu Usuário', `Removeu o login de ${target.name} (${target.email}).`);
    if (currentUser?.id === id) {
      setCurrentUser(users.find(u => u.id !== id) || null);
    }
  }, [users, currentUser, logAction]);

  const toggleUserCanEdit = useCallback((userId: string, canEdit: boolean) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, canEdit };
        logAction(
          canEdit ? 'Concedeu Permissão' : 'Revogou Permissão',
          `${canEdit ? 'Concedeu' : 'Revogou'} permissão de edição para ${u.name} (${u.role}).`
        );
        return updated;
      }
      return u;
    }));
  }, [logAction]);

  // Admin Data Cleanup
  const clearSampleAdventurers = useCallback(() => {
    setAdventurers([]);
    setEarnedSpecialties([]);
    setTestRecords([]);
    setClassProgress({});
    logAction('Limpeza de Dados', 'Removeu aventureiros e registros de demonstração.');
  }, [logAction]);

  const clearAllRecords = useCallback(() => {
    setEarnedSpecialties([]);
    setTestRecords([]);
    setClassProgress({});
    logAction('Limpeza de Registros', 'Limpou todas as especialidades e provas registradas.');
  }, [logAction]);

  // Reset to default demo data
  const resetToDemoData = useCallback(() => {
    if (window.confirm('Tem certeza que deseja restaurar os dados de demonstração iniciais? Todas as edições locais serão substituídas.')) {
      setUsers(INITIAL_USERS);
      setUnits(INITIAL_UNITS);
      setAdventurers(INITIAL_ADVENTURERS);
      setSpecialtiesCatalog(INITIAL_SPECIALTIES_CATALOG);
      setEarnedSpecialties(INITIAL_EARNED_SPECIALTIES);
      setTestRecords(INITIAL_TEST_RECORDS);
      setClassProgress(INITIAL_CLASS_PROGRESS);
      setScheduleItems(INITIAL_SCHEDULE_ITEMS);
      setReminders(INITIAL_REMINDERS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setClubSettings(INITIAL_CLUB_SETTINGS);
      setSpecialtyCategories(INITIAL_SPECIALTY_CATEGORIES);
      const henrique = INITIAL_USERS.find(u => u.email === 'henriquesil1812@gmail.com') || INITIAL_USERS[0];
      setCurrentUser(henrique);
      localStorage.setItem(AUTH_KEY, henrique.id);
      logAction('Restauração de Dados', 'Restaurou a base com os dados iniciais do Clube.');
    }
  }, [logAction]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        units,
        adventurers,
        specialtiesCatalog,
        earnedSpecialties,
        testRecords,
        classRequirements,
        classProgress,
        scheduleItems,
        reminders,
        auditLogs,
        clubSettings,
        specialtyCategories,
        canEdit,
        isInstructor,
        lastSavedAt,
        currentTab,
        setCurrentTab,
        login,
        logout,
        switchUser,
        requestPasswordReset,
        setUserPassword,
        updateClubSettings,
        addSpecialtyCategory,
        updateSpecialtyCategory,
        deleteSpecialtyCategory,
        addAdventurer,
        updateAdventurer,
        deleteAdventurer,
        addUnit,
        updateUnit,
        deleteUnit,
        addEarnedSpecialty,
        updateEarnedSpecialty,
        deleteEarnedSpecialty,
        addCatalogSpecialty,
        updateCatalogSpecialty,
        deleteCatalogSpecialty,
        addTestRecord,
        updateTestRecord,
        deleteTestRecord,
        toggleRequirement,
        addScheduleItem,
        updateScheduleItem,
        deleteScheduleItem,
        addReminder,
        updateReminder,
        deleteReminder,
        addUser,
        updateUser,
        deleteUser,
        toggleUserCanEdit,
        resetToDemoData,
        clearSampleAdventurers,
        clearAllRecords,
        logAction
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
