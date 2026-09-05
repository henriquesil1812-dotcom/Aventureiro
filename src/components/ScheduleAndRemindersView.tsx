import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleItem, ReminderNotice } from '../types';
import { 
  Calendar, 
  Share2, 
  Plus, 
  Copy, 
  Check, 
  Clock, 
  MapPin, 
  User, 
  Trash2, 
  Edit2, 
  MessageCircle, 
  CalendarClock,
  Sparkles,
  X,
  Save
} from 'lucide-react';
import { formatDateBR, generateWhatsAppMessage } from '../utils/formatters';

export const ScheduleAndRemindersView: React.FC = () => {
  const { 
    scheduleItems, 
    addScheduleItem, 
    updateScheduleItem, 
    deleteScheduleItem, 
    reminders, 
    addReminder, 
    updateReminder,
    deleteReminder,
    canEdit,
    currentUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reminders' | 'schedule'>('reminders');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Reminder Form State
  const [remDate, setRemDate] = useState(new Date().toISOString().slice(0, 10));
  const [remActivity, setRemActivity] = useState('');
  const [remTime, setRemTime] = useState('14:30');
  const [remResponsible, setRemResponsible] = useState(currentUser?.name || '');
  const [remLocation, setRemLocation] = useState('Salão Social da Igreja');
  const [remTargetGroup, setRemTargetGroup] = useState('Grupo de Pais no WhatsApp');
  const [remNotes, setRemNotes] = useState('');
  const [livePreviewText, setLivePreviewText] = useState('');

  // Schedule modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [schedSpecName, setSchedSpecName] = useState('');
  const [schedDate, setSchedDate] = useState(new Date().toISOString().slice(0, 10));
  const [schedTime, setSchedTime] = useState('14:30');
  const [schedResponsible, setSchedResponsible] = useState('');
  const [schedLocation, setSchedLocation] = useState('Igreja Central');
  const [schedObs, setSchedObs] = useState('');

  // Edit Reminder state
  const [editingReminder, setEditingReminder] = useState<ReminderNotice | null>(null);
  const [editRemDate, setEditRemDate] = useState('');
  const [editRemActivity, setEditRemActivity] = useState('');
  const [editRemTime, setEditRemTime] = useState('14:30');
  const [editRemResponsible, setEditRemResponsible] = useState('');
  const [editRemLocation, setEditRemLocation] = useState('');
  const [editRemTargetGroup, setEditRemTargetGroup] = useState('');
  const [editRemNotes, setEditRemNotes] = useState('');

  const handleStartEditReminder = (rem: ReminderNotice) => {
    setEditingReminder(rem);
    setEditRemDate(rem.date);
    setEditRemActivity(rem.activity);
    setEditRemTime(rem.time);
    setEditRemResponsible(rem.responsible);
    setEditRemLocation(rem.location);
    setEditRemTargetGroup(rem.targetGroup || '');
    setEditRemNotes('');
  };

  const handleSaveEditReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReminder) return;
    const formatted = generateWhatsAppMessage({
      date: editRemDate,
      activity: editRemActivity.trim(),
      time: editRemTime.trim(),
      responsible: editRemResponsible.trim(),
      location: editRemLocation.trim(),
      notes: editRemNotes.trim(),
    });
    updateReminder(editingReminder.id, {
      date: editRemDate,
      activity: editRemActivity.trim(),
      time: editRemTime.trim(),
      responsible: editRemResponsible.trim(),
      location: editRemLocation.trim(),
      targetGroup: editRemTargetGroup.trim(),
      formattedText: formatted,
    });
    setEditingReminder(null);
  };

  // Auto-generate WhatsApp preview on changes
  useEffect(() => {
    const text = generateWhatsAppMessage({
      date: remDate,
      activity: remActivity || '[Nome da Especialidade / Atividade]',
      time: remTime || '[Horário]',
      responsible: remResponsible || '[Responsável]',
      location: remLocation || '[Local]',
      notes: remNotes,
    });
    setLivePreviewText(text);
  }, [remDate, remActivity, remTime, remResponsible, remLocation, remNotes]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remActivity.trim()) {
      alert('Informe a atividade ou especialidade.');
      return;
    }

    addReminder({
      date: remDate,
      activity: remActivity.trim(),
      time: remTime.trim(),
      responsible: remResponsible.trim(),
      location: remLocation.trim(),
      targetGroup: remTargetGroup.trim(),
      formattedText: livePreviewText,
    });

    setRemActivity('');
    setRemNotes('');
    alert('Lembrete salvo com sucesso! O texto está pronto para ser copiado.');
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedSpecName.trim()) return;

    if (editingScheduleId) {
      updateScheduleItem(editingScheduleId, {
        specialtyName: schedSpecName.trim(),
        plannedDate: schedDate,
        time: schedTime,
        responsible: schedResponsible.trim(),
        location: schedLocation.trim(),
        observations: schedObs.trim(),
      });
      setEditingScheduleId(null);
    } else {
      addScheduleItem({
        specialtyName: schedSpecName.trim(),
        plannedDate: schedDate,
        time: schedTime,
        responsible: schedResponsible.trim() || currentUser?.name || 'Diretoria',
        location: schedLocation.trim() || 'Salão da Igreja',
        observations: schedObs.trim(),
        status: 'Planejado',
      });
    }

    setShowScheduleModal(false);
    setSchedSpecName('');
    setSchedObs('');
  };

  const openEditSchedule = (item: ScheduleItem) => {
    setEditingScheduleId(item.id);
    setSchedSpecName(item.specialtyName);
    setSchedDate(item.plannedDate);
    setSchedTime(item.time);
    setSchedResponsible(item.responsible);
    setSchedLocation(item.location);
    setSchedObs(item.observations || '');
    setShowScheduleModal(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif flex items-center space-x-2">
            <span>Cronograma & Lembretes</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Planejamento & WhatsApp
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerador automático de comunicados formatados para pais e cronograma oficial
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('reminders')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reminders'
                ? 'bg-white text-purple-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Gerador WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schedule'
                ? 'bg-white text-purple-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Cronograma de Especialidades</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LEMBRETES & COMUNICADOS WHATSAPP */}
      {activeTab === 'reminders' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Interactive Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-serif flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Criar Lembrete Automático</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha os campos abaixo e o texto pronto para WhatsApp será gerado instantaneamente
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveReminder} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dia (Data da Reunião) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={remDate}
                      onChange={(e) => setRemDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Horário <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ex: 14h ou 14:30"
                      value={remTime}
                      onChange={(e) => setRemTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Especialidade ou Atividade <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Nós e Amarras (ou Prova de Primeiros Socorros)"
                    value={remActivity}
                    onChange={(e) => setRemActivity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Responsável / Instrutor <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Instrutor João ou Diretoria"
                      value={remResponsible}
                      onChange={(e) => setRemResponsible(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Local <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Salão da igreja ou Parque Municipal"
                      value={remLocation}
                      onChange={(e) => setRemLocation(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                </div>

                {/* Optional Target and Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Destino do Envio (Anotação de controle)
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Grupo de Pais ou Unidade Estrelinhas"
                      value={remTargetGroup}
                      onChange={(e) => setRemTargetGroup(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Aviso extra / Observação (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Trazer lenço oficial e Bíblia"
                      value={remNotes}
                      onChange={(e) => setRemNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {canEdit && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Salvar na Lista de Lembretes</span>
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Right: Real-time Live Preview & 1-Click Copy (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#1E0B36] via-purple-950 to-[#2A0E4B] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-purple-800/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-purple-800/60 mb-4">
                  <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Prévia em Tempo Real</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-400/30">
                    WhatsApp Pronto
                  </span>
                </div>

                {/* WhatsApp speech bubble simulation */}
                <div className="relative p-4 rounded-2xl bg-[#120722]/80 border border-purple-800 text-xs font-sans whitespace-pre-line text-purple-100 leading-relaxed shadow-inner">
                  {livePreviewText}
                </div>

                <div className="mt-3 text-[11px] text-purple-300/80 space-y-1">
                  <p>• Copie e cole diretamente no seu aplicativo do WhatsApp.</p>
                  <p>• Destino anotado: <strong className="text-white">{remTargetGroup || 'Não especificado'}</strong></p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-purple-800/60 space-y-2">
                <button
                  type="button"
                  onClick={() => handleCopyText(livePreviewText, 'live-preview')}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                >
                  {copiedId === 'live-preview' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" />
                      <span className="text-emerald-950 font-extrabold">Mensagem Copiada! Cole no WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-purple-950" />
                      <span>Copiar Mensagem do WhatsApp</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* HISTÓRICO DE LEMBRETES CADASTRADOS */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 font-serif flex items-center space-x-2">
              <Share2 className="w-4 h-4 text-purple-700" />
              <span>Avisos e Lembretes Arquivados</span>
            </h3>

            {reminders.length === 0 ? (
              <p className="text-xs text-slate-400">Nenhum aviso arquivado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reminders.map(rem => (
                  <div key={rem.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            {formatDateBR(rem.date)} às {rem.time}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 mt-1">{rem.activity}</h4>
                        </div>
                        {canEdit && (
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleStartEditReminder(rem)}
                              className="text-purple-700 hover:bg-purple-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Editar lembrete"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Deseja realmente excluir o lembrete "${rem.activity}"?`)) {
                                  deleteReminder(rem.id);
                                }
                              }}
                              className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Excluir lembrete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-sans text-slate-700 whitespace-pre-line max-h-32 overflow-y-auto leading-relaxed">
                        {rem.formattedText}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                        Para: <strong>{rem.targetGroup || 'Geral'}</strong>
                      </span>
                      <button
                        onClick={() => handleCopyText(rem.formattedText, rem.id)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-[11px] flex items-center space-x-1 transition-colors"
                      >
                        {copiedId === rem.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-700" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Texto</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: CRONOGRAMA DE ESPECIALIDADES */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-slate-900 font-serif">Planejamento das Próximas Reuniões</h3>
              <p className="text-xs text-slate-500">Cronograma de especialidades previstas para os próximos meses</p>
            </div>

            {canEdit && (
              <button
                onClick={() => {
                  setEditingScheduleId(null);
                  setSchedSpecName('');
                  setSchedObs('');
                  setShowScheduleModal(true);
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Agendar Especialidade</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {scheduleItems.map(item => (
              <div key={item.id} className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-800 flex flex-col items-center justify-center flex-shrink-0 font-bold">
                    <span className="text-base leading-none">{item.plannedDate.split('-')[2]}</span>
                    <span className="text-[9px] uppercase tracking-wider text-purple-600">
                      {new Date(item.plannedDate + 'T12:00:00Z').toLocaleString('pt-BR', { month: 'short' })}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-900">{item.specialtyName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        {item.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        {item.time}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1 text-slate-400" />
                        {item.responsible}
                      </span>
                      <span className="flex items-center text-purple-700 font-medium">
                        <MapPin className="w-3 h-3 mr-1 text-purple-500" />
                        {item.location}
                      </span>
                    </div>

                    {item.observations && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        Obs: {item.observations}
                      </p>
                    )}
                  </div>
                </div>

                {canEdit && (
                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      onClick={() => openEditSchedule(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir agendamento de "${item.specialtyName}"?`)) {
                          deleteScheduleItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCHEDULE CREATE/EDIT MODAL */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <CalendarClock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-serif">
                {editingScheduleId ? 'Editar Item do Cronograma' : 'Agendar Especialidade'}
              </h3>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Especialidade / Atividade</label>
                <input
                  type="text"
                  placeholder="ex: Astrônomo Mirim"
                  value={schedSpecName}
                  onChange={(e) => setSchedSpecName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data Prevista</label>
                  <input
                    type="date"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Horário</label>
                  <input
                    type="text"
                    placeholder="14:30"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Responsável / Instrutor</label>
                <input
                  type="text"
                  placeholder="ex: Instrutor Marcos"
                  value={schedResponsible}
                  onChange={(e) => setSchedResponsible(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Local</label>
                <input
                  type="text"
                  placeholder="ex: Salão Social da Igreja"
                  value={schedLocation}
                  onChange={(e) => setSchedLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observações e Materiais</label>
                <textarea
                  rows={2}
                  placeholder="ex: Trazer lanternas e agasalho..."
                  value={schedObs}
                  onChange={(e) => setSchedObs(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR LEMBRETE ARQUIVADO */}
      {editingReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-900 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingReminder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif">Editar Lembrete / Aviso</h3>
                <p className="text-xs text-slate-500">Atualize os dados e regenere o texto para o WhatsApp</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditReminder} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Especialidade / Atividade</label>
                <input
                  type="text"
                  value={editRemActivity}
                  onChange={(e) => setEditRemActivity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={editRemDate}
                    onChange={(e) => setEditRemDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    value={editRemTime}
                    onChange={(e) => setEditRemTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Responsável</label>
                  <input
                    type="text"
                    value={editRemResponsible}
                    onChange={(e) => setEditRemResponsible(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Local</label>
                  <input
                    type="text"
                    value={editRemLocation}
                    onChange={(e) => setEditRemLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destino (Grupo / Unidade)</label>
                  <input
                    type="text"
                    value={editRemTargetGroup}
                    onChange={(e) => setEditRemTargetGroup(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Anotações extras</label>
                  <input
                    type="text"
                    value={editRemNotes}
                    onChange={(e) => setEditRemNotes(e.target.value)}
                    placeholder="ex: Trazer uniforme de gala..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingReminder(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950 shadow-md cursor-pointer flex items-center space-x-1.5"
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
