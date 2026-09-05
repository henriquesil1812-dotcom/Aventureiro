export type UserRole = 'INSTRUTOR' | 'DIRETOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  canEdit: boolean; // For DIRETOR: if true, granted temporary or permanent edit access by an Instrutor
  avatar?: string;
  password?: string; // Optional password set by user
  createdAt: string;
}

export type AdventurerClass = 
  | 'Abelhinhas Laboriosas' 
  | 'Luminares' 
  | 'Edificadores' 
  | 'Mãos Ajudadoras';

export interface Unit {
  id: string;
  name: string;
  counselorName: string;
  color: string;
  ageRange: string;
  symbol: string;
}

export interface Adventurer {
  id: string;
  name: string;
  age: number;
  unitId: string;
  currentClass: AdventurerClass;
  photoUrl?: string;
  parentName: string;
  parentPhone: string;
  parentRelationship: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type SpecialtyCategory = string;

export interface ClubSettings {
  clubName: string;
  clubSubtitle: string;
  clubMotto: string;
  districtAssociation: string;
}

export interface CatalogSpecialty {
  id: string;
  name: string;
  category: SpecialtyCategory;
  description: string;
  requirementsCount: number;
}

export interface EarnedSpecialty {
  id: string;
  adventurerId: string;
  specialtyName: string;
  category: SpecialtyCategory;
  completionDate: string; // YYYY-MM-DD
  instructorName: string; // The instructor who evaluated/taught it
  notes?: string;
}

export type TestResultType = 'status' | 'numeric';
export type TestStatus = 'Aprovado' | 'Reprovado' | 'Pendente';

export interface TestRecord {
  id: string;
  adventurerId: string;
  testName: string;
  date: string; // YYYY-MM-DD
  resultType: TestResultType;
  status?: TestStatus;
  numericScore?: number;
  maxScore?: number;
  examinerName: string;
  notes?: string;
}

export interface ClassRequirement {
  id: string;
  className: AdventurerClass;
  title: string;
  category: 'Geral' | 'Meu Deus' | 'Meu Eu' | 'Minha Família' | 'Meu Mundo';
  description: string;
}

export interface AdventurerClassProgress {
  adventurerId: string;
  completedRequirementIds: string[];
}

export interface ScheduleItem {
  id: string;
  specialtyName: string;
  plannedDate: string; // YYYY-MM-DD
  time: string;
  responsible: string;
  location: string;
  observations?: string;
  status: 'Planejado' | 'Realizado' | 'Cancelado';
}

export interface ReminderNotice {
  id: string;
  date: string; // YYYY-MM-DD
  activity: string;
  time: string;
  responsible: string;
  location: string;
  targetGroup?: string;
  formattedText: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}
