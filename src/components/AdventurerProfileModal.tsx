import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Adventurer, AdventurerClass, EarnedSpecialty, TestRecord } from '../types';
import { 
  X, 
  Star, 
  Award, 
  FileCheck2, 
  CheckCircle, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Edit3, 
  Edit2,
  Plus, 
  Trash2, 
  Calendar,
  AlertCircle,
  Save
} from 'lucide-react';
import { formatDateBR } from '../utils/formatters';
import { EditAdventurerModal } from './EditAdventurerModal';

interface AdventurerProfileModalProps {
  adventurer: Adventurer;
  onClose: () => void;
  onOpenAwardSpecialty: (adventurerId: string) => void;
  onOpenNewTest: (adventurerId: string) => void;
}

export const AdventurerProfileModal: React.FC<AdventurerProfileModalProps> = ({
  adventurer,
  onClose,
  onOpenAwardSpecialty,
  onOpenNewTest,
}) => {
  const { 
    adventurers,
    units, 
    earnedSpecialties, 
    updateEarnedSpecialty,
    deleteEarnedSpecialty,
    testRecords, 
    updateTestRecord,
    deleteTestRecord,
    classRequirements, 
    classProgress, 
    toggleRequirement, 
    updateAdventurer, 
    deleteAdventurer,
    canEdit 
  } = useApp();

  // Keep synced with context updates
  const currentAdv = adventurers.find(a => a.id === adventurer.id) || adventurer;

  const [activeTab, setActiveTab] = useState<'progress' | 'specialties' | 'tests' | 'info'>('progress');
  const [showEditModal, setShowEditModal] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Form states for editing basic info
  const [editName, setEditName] = useState(adventurer.name);
  const [editAge, setEditAge] = useState(adventurer.age);
  const [editUnitId, setEditUnitId] = useState(adventurer.unitId);
  const [editClass, setEditClass] = useState<AdventurerClass>(adventurer.currentClass);
  const [editParentName, setEditParentName] = useState(adventurer.parentName);
  const [editParentPhone, setEditParentPhone] = useState(adventurer.parentPhone);
  const [editNotes, setEditNotes] = useState(adventurer.notes || '');

  // Edit earned specialty state
  const [editingEarnedItem, setEditingEarnedItem] = useState<EarnedSpecialty | null>(null);
  const [editEarnedInstructor, setEditEarnedInstructor] = useState('');
  const [editEarnedDate, setEditEarnedDate] = useState('');
  const [editEarnedNotes, setEditEarnedNotes] = useState('');

  const handleStartEditEarned = (sp: EarnedSpecialty) => {
    setEditingEarnedItem(sp);
    setEditEarnedInstructor(sp.instructorName);
    setEditEarnedDate(sp.completionDate);
    setEditEarnedNotes(sp.notes || '');
  };

  const handleSaveEditEarned = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEarnedItem) return;
    updateEarnedSpecialty(editingEarnedItem.id, {
      instructorName: editEarnedInstructor.trim(),
      completionDate: editEarnedDate,
      notes: editEarnedNotes.trim(),
    });
    setEditingEarnedItem(null);
  };

  // Edit test item state
  const [editingTestItem, setEditingTestItem] = useState<TestRecord | null>(null);
  const [editTestScore, setEditTestScore] = useState<number>(10);
  const [editTestStatus, setEditTestStatus] = useState<'Aprovado' | 'Reprovado'>('Aprovado');
  const [editTestExaminer, setEditTestExaminer] = useState('');
  const [editTestDate, setEditTestDate] = useState('');
  const [editTestNotes, setEditTestNotes] = useState('');

  const handleStartEditTest = (test: TestRecord) => {
    setEditingTestItem(test);
    setEditTestScore(test.numericScore ?? 10);
    setEditTestStatus(test.status === 'Aprovado' ? 'Aprovado' : 'Reprovado');
    setEditTestExaminer(test.examinerName);
    setEditTestDate(test.date);
    setEditTestNotes(test.notes || '');
  };

  const handleSaveEditTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestItem) return;
    updateTestRecord(editingTestItem.id, {
      examinerName: editTestExaminer.trim(),
      date: editTestDate,
      numericScore: Number(editTestScore),
      status: editingTestItem.resultType === 'numeric'
        ? (Number(editTestScore) >= 7 ? 'Aprovado' : 'Reprovado')
        : editTestStatus,
      notes: editTestNotes.trim(),
    });
    setEditingTestItem(null);
  };

  const unit = units.find(u => u.id === adventurer.unitId);
  const mySpecialties = earnedSpecialties.filter(e => e.adventurerId === adventurer.id);
  const myTests = testRecords.filter(t => t.adventurerId === adventurer.id);

  // Class requirements for the adventurer's current class
  const classReqs = classRequirements.filter(r => r.className === adventurer.currentClass);
  const completedIds = classProgress[adventurer.id] || [];
  const completedCount = classReqs.filter(r => completedIds.includes(r.id)).length;
  const progressPercentage = classReqs.length > 0 
    ? Math.round((completedCount / classReqs.length) * 100) 
    : 0;

  // Format clean phone for WhatsApp link (e.g. 5511987654321)
  const cleanPhone = adventurer.parentPhone.replace(/\D/g, '');
  const waUrl = cleanPhone ? `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%2C%20sou%20da%20diretoria%20do%20Clube%20de%20Aventureiros%20Heran%C3%A7a%20do%20C%C3%A9u%20sobre%20o(a)%20${encodeURIComponent(adventurer.name)}.` : null;

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdventurer(adventurer.id, {
      name: editName,
      age: Number(editAge),
      unitId: editUnitId,
      currentClass: editClass,
      parentName: editParentName,
      parentPhone: editParentPhone,
      notes: editNotes,
    });
    setIsEditingInfo(false);
  };

  const handleDeleteSelf = () => {
    if (window.confirm(`Tem certeza que deseja excluir o cadastro de ${adventurer.name}? Todos os registros de especialidades e provas vinculados serão apagados.`)) {
      deleteAdventurer(adventurer.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-slate-100 my-auto max-h-[92vh] flex flex-col">
        
        {/* Top Header Card (Night Sky & Star Atmosphere) */}
        <div className="relative bg-gradient-to-r from-purple-950 via-purple-900 to-[#1F0A38] text-white p-5 sm:p-6 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Starry particles */}
          <div className="absolute top-3 left-1/3 w-1.5 h-1.5 bg-amber-300 rounded-full blur-[0.5px] animate-pulse" />
          <div className="absolute bottom-3 right-1/4 w-2 h-2 bg-amber-400 rounded-full blur-[1px] opacity-60" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar / Photo */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-purple-900 flex-shrink-0">
              {currentAdv.photoUrl ? (
                <img src={currentAdv.photoUrl} alt={currentAdv.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-amber-300">
                  {currentAdv.name.charAt(0)}
                </div>
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-center text-amber-300 py-0.5 font-bold">
                {currentAdv.age} anos
              </div>
            </div>

            {/* General Info */}
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  {currentAdv.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-purple-950 shadow-sm">
                  {currentAdv.currentClass}
                </span>

                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setShowEditModal(true)}
                    className="px-3 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all border border-white/20 ml-1"
                    title="Editar dados cadastrais, alterar ou remover foto"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Editar Perfil</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-purple-200">
                <span className="flex items-center">
                  <span className="mr-1">{unit?.symbol || '⭐'}</span>
                  Unidade: <strong className="ml-1 text-white">{unit?.name || 'Sem unidade'}</strong>
                </span>
                <span>•</span>
                <span>Responsável: <strong className="text-white">{currentAdv.parentName}</strong></span>
              </div>

              {/* Parent Phone & WhatsApp Link */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center text-xs text-purple-300 bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-800">
                  <Phone className="w-3 h-3 mr-1 text-amber-400" />
                  {currentAdv.parentPhone}
                </span>
                {waUrl && (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-2.5 py-1 rounded-lg transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Mini Star Counter Pill */}
            <div className="bg-purple-950/80 border border-amber-400/40 rounded-2xl p-3 text-center sm:min-w-[120px] shadow-lg">
              <div className="flex items-center justify-center text-amber-300 space-x-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
                <span className="text-2xl font-black font-serif">{mySpecialties.length}</span>
              </div>
              <p className="text-[10px] text-purple-200 font-semibold uppercase tracking-wider mt-0.5">
                Estrelas Conquistadas
              </p>
            </div>
          </div>

          {/* Navigation Subtabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 mt-5 pt-3 border-t border-purple-800/60 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'progress'
                  ? 'bg-amber-400 text-purple-950 shadow-sm'
                  : 'text-purple-200 hover:bg-purple-900/60'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Progresso de Classe ({progressPercentage}%)</span>
            </button>

            <button
              onClick={() => setActiveTab('specialties')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'specialties'
                  ? 'bg-amber-400 text-purple-950 shadow-sm'
                  : 'text-purple-200 hover:bg-purple-900/60'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Especialidades ({mySpecialties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'tests'
                  ? 'bg-amber-400 text-purple-950 shadow-sm'
                  : 'text-purple-200 hover:bg-purple-900/60'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Provas ({myTests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeTab === 'info'
                  ? 'bg-amber-400 text-purple-950 shadow-sm'
                  : 'text-purple-200 hover:bg-purple-900/60'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Dados Cadastrais</span>
            </button>
          </div>

        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: PROGRESSO DE CLASSE / REQUISITOS */}
          {activeTab === 'progress' && (
            <div className="space-y-5">
              {/* Progress Bar Card */}
              <div className="bg-gradient-to-br from-purple-50 to-amber-50/40 p-4 sm:p-5 rounded-2xl border border-purple-100">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                      Classe Atual: {adventurer.currentClass}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {completedCount} de {classReqs.length} requisitos cumpridos
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-purple-950 font-serif">
                      {progressPercentage}%
                    </span>
                    <p className="text-[10px] text-slate-500 font-medium">para a investidura</p>
                  </div>
                </div>

                <div className="w-full bg-purple-200/60 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-700 to-amber-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 font-serif">
                    Caderno de Requisitos da Classe
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    {canEdit ? 'Clique para marcar/desmarcar (salva automaticamente)' : 'Somente leitura'}
                  </span>
                </div>

                <div className="space-y-2">
                  {classReqs.map(req => {
                    const isDone = completedIds.includes(req.id);
                    return (
                      <div
                        key={req.id}
                        onClick={() => canEdit && toggleRequirement(adventurer.id, req.id)}
                        className={`p-3.5 rounded-2xl border transition-all flex items-start space-x-3 ${
                          canEdit ? 'cursor-pointer' : ''
                        } ${
                          isDone 
                            ? 'bg-emerald-50/60 border-emerald-200' 
                            : 'bg-white border-slate-100 hover:border-purple-200'
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                        }`}>
                          {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                              {req.category}
                            </span>
                            <span className={`text-xs font-bold ${isDone ? 'text-emerald-950 line-through' : 'text-slate-800'}`}>
                              {req.title}
                            </span>
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${isDone ? 'text-emerald-800/80' : 'text-slate-600'}`}>
                            {req.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ESPECIALIDADES CONQUISTADAS ("CÉU ESTRELADO") */}
          {activeTab === 'specialties' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-serif flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Constelação de Especialidades</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Cada insígnia conquistada brilha como uma estrela no céu do aventureiro
                  </p>
                </div>

                {canEdit && (
                  <button
                    onClick={() => onOpenAwardSpecialty(adventurer.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs shadow transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Lançar Especialidade</span>
                  </button>
                )}
              </div>

              {mySpecialties.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Nenhuma especialidade conquistada ainda.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Use o botão acima para registrar a primeira estrela deste aventureiro.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mySpecialties.map(sp => (
                    <div key={sp.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-amber-200 transition-all flex items-start justify-between group">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                            {sp.category}
                          </span>
                          <h5 className="font-bold text-xs sm:text-sm text-slate-900">{sp.specialtyName}</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center">
                            <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                            {formatDateBR(sp.completionDate)}
                          </p>
                          <p className="text-[11px] text-purple-800 font-medium mt-0.5">
                            Instrutor(a): {sp.instructorName}
                          </p>
                          {sp.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-1">
                              "{sp.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {canEdit && (
                        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => handleStartEditEarned(sp)}
                            className="text-purple-700 hover:bg-purple-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Editar lançamento da especialidade"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Deseja realmente remover a especialidade "${sp.specialtyName}" deste aventureiro?`)) {
                                deleteEarnedSpecialty(sp.id);
                              }
                            }}
                            className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                            title="Remover especialidade"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROVAS E TESTES */}
          {activeTab === 'tests' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-serif flex items-center space-x-1.5">
                    <FileCheck2 className="w-4 h-4 text-purple-700" />
                    <span>Histórico de Provas e Avaliações</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Registro de avaliações práticas, orais e teóricas realizadas
                  </p>
                </div>

                {canEdit && (
                  <button
                    onClick={() => onOpenNewTest(adventurer.id)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Registrar Prova</span>
                  </button>
                )}
              </div>

              {myTests.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                  <FileCheck2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Nenhuma prova registrada até o momento.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Registre testes práticos de nós, primeiros socorros ou voto.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myTests.map(test => {
                    const isApproved = test.status === 'Aprovado' || (test.numericScore && test.numericScore >= 7);
                    return (
                      <div key={test.id} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-between group">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-xs sm:text-sm text-slate-900">{test.testName}</h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {test.resultType === 'numeric' 
                                ? `Nota: ${test.numericScore}/${test.maxScore || 10}` 
                                : test.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Data: {formatDateBR(test.date)} • Avaliador: {test.examinerName}
                          </p>
                          {test.notes && (
                            <p className="text-[11px] text-slate-400 italic">
                              "{test.notes}"
                            </p>
                          )}
                        </div>

                        {canEdit && (
                          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditTest(test)}
                              className="text-purple-700 hover:bg-purple-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Editar avaliação da prova"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Deseja realmente excluir a avaliação da prova "${test.testName}"?`)) {
                                  deleteTestRecord(test.id);
                                }
                              }}
                              className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Excluir prova"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DADOS CADASTRAIS & EDIÇÃO */}
          {activeTab === 'info' && (
            <div>
              {!isEditingInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold block">Nome Completo</span>
                      <span className="text-sm font-bold text-slate-900">{adventurer.name}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold block">Idade</span>
                      <span className="text-sm font-bold text-slate-900">{adventurer.age} anos</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold block">Unidade / Turma</span>
                      <span className="text-sm font-bold text-slate-900">{unit?.name || 'Não atribuída'}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold block">Classe Atual</span>
                      <span className="text-sm font-bold text-slate-900">{adventurer.currentClass}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold block">Responsável</span>
                      <span className="text-sm font-bold text-slate-900">{adventurer.parentName}</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold block">Telefone / WhatsApp</span>
                      <span className="text-sm font-bold text-slate-900">{adventurer.parentPhone}</span>
                    </div>
                  </div>

                  {adventurer.notes && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[11px] text-slate-400 font-semibold block">Observações & Saúde</span>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{adventurer.notes}</p>
                    </div>
                  )}

                  {canEdit && (
                    <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                      <button
                        onClick={() => setIsEditingInfo(true)}
                        className="px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Editar Dados Cadastrais</span>
                      </button>

                      <button
                        onClick={handleDeleteSelf}
                        className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Aventureiro</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveInfo} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-slate-900">Editar Cadastro</h4>
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Idade</label>
                      <input
                        type="number"
                        min={5}
                        max={12}
                        value={editAge}
                        onChange={(e) => setEditAge(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Unidade / Turma</label>
                      <select
                        value={editUnitId}
                        onChange={(e) => setEditUnitId(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        {units.map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.ageRange})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Classe Atual</label>
                      <select
                        value={editClass}
                        onChange={(e) => setEditClass(e.target.value as AdventurerClass)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="Abelhinhas Laboriosas">Abelhinhas Laboriosas (6 anos)</option>
                        <option value="Luminares">Luminares (7 anos)</option>
                        <option value="Edificadores">Edificadores (8 anos)</option>
                        <option value="Mãos Ajudadoras">Mãos Ajudadoras (9 anos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome do Responsável</label>
                      <input
                        type="text"
                        value={editParentName}
                        onChange={(e) => setEditParentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp</label>
                      <input
                        type="text"
                        value={editParentPhone}
                        onChange={(e) => setEditParentPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Observações & Cuidados</label>
                    <textarea
                      rows={2}
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(false)}
                      className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-purple-900 text-white font-semibold text-xs hover:bg-purple-950"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>

      {/* EDIT ADVENTURER & PHOTO MODAL */}
      {showEditModal && (
        <EditAdventurerModal
          adventurer={currentAdv}
          onClose={() => setShowEditModal(false)}
          onDeleted={() => {
            setShowEditModal(false);
            onClose();
          }}
        />
      )}

      {/* MODAL: EDITAR ESPECIALIDADE LANÇADA */}
      {editingEarnedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setEditingEarnedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif">Editar Especialidade</h3>
                <p className="text-xs text-slate-500">{editingEarnedItem.specialtyName} • {adventurer.name}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditEarned} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instrutor / Avaliador</label>
                <input
                  type="text"
                  value={editEarnedInstructor}
                  onChange={(e) => setEditEarnedInstructor(e.target.value)}
                  placeholder="Nome do avaliador..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data de Conclusão</label>
                <input
                  type="date"
                  value={editEarnedDate}
                  onChange={(e) => setEditEarnedDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observações / Anotações</label>
                <textarea
                  rows={3}
                  value={editEarnedNotes}
                  onChange={(e) => setEditEarnedNotes(e.target.value)}
                  placeholder="Anotações sobre a conclusão..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEarnedItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950 transition-colors shadow-md cursor-pointer flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR AVALIAÇÃO DE PROVA */}
      {editingTestItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setEditingTestItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif">Editar Prova</h3>
                <p className="text-xs text-slate-500">{editingTestItem.testName} • {adventurer.name}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditTest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Avaliador / Instrutor</label>
                <input
                  type="text"
                  value={editTestExaminer}
                  onChange={(e) => setEditTestExaminer(e.target.value)}
                  placeholder="Nome do avaliador..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data da Avaliação</label>
                <input
                  type="date"
                  value={editTestDate}
                  onChange={(e) => setEditTestDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              {editingTestItem.resultType === 'numeric' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nota (0 a {editingTestItem.maxScore || 10})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={editingTestItem.maxScore || 10}
                    step={0.5}
                    value={editTestScore}
                    onChange={(e) => setEditTestScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Nota 7.0 ou superior considera aprovado.</p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Resultado / Status</label>
                  <select
                    value={editTestStatus}
                    onChange={(e) => setEditTestStatus(e.target.value as 'Aprovado' | 'Reprovado')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Aprovado">Aprovado</option>
                    <option value="Reprovado">Reprovado</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observações do Avaliador</label>
                <textarea
                  rows={2}
                  value={editTestNotes}
                  onChange={(e) => setEditTestNotes(e.target.value)}
                  placeholder="Feedback sobre o desempenho prático ou teórico..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTestItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950 transition-colors shadow-md cursor-pointer flex items-center space-x-1.5"
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
