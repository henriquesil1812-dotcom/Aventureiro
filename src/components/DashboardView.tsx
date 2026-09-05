import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Users, 
  Award, 
  FileCheck2, 
  Calendar, 
  ArrowUpRight, 
  Plus, 
  Copy, 
  Check, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  ChevronRight, 
  Star,
  Flame,
  Share2,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { formatDateBR } from '../utils/formatters';

interface DashboardViewProps {
  onNavigate: (tab: string, extra?: any) => void;
  onOpenNewAdventurer: () => void;
  onOpenNewSpecialty: () => void;
  onOpenNewTest: () => void;
  onOpenNewReminder: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewAdventurer,
  onOpenNewSpecialty,
  onOpenNewTest,
  onOpenNewReminder,
}) => {
  const { 
    currentUser, 
    adventurers, 
    units, 
    earnedSpecialties, 
    testRecords, 
    scheduleItems, 
    reminders,
    canEdit,
    clubSettings
  } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Computed metrics
  const totalAdventurers = adventurers.length;
  const totalEarnedSpecialties = earnedSpecialties.length;
  const approvedTests = testRecords.filter(t => t.status === 'Aprovado' || (t.numericScore && t.numericScore >= 7)).length;
  const passRate = testRecords.length > 0 ? Math.round((approvedTests / testRecords.length) * 100) : 100;
  
  // Next scheduled activity
  const upcomingSchedule = scheduleItems.slice(0, 3);
  const nextReminder = reminders[0];

  // Conquered specialties grouped by unit
  const unitStats = units.map(unit => {
    const unitAdvIds = adventurers.filter(a => a.unitId === unit.id).map(a => a.id);
    const specsCount = earnedSpecialties.filter(e => unitAdvIds.includes(e.adventurerId)).length;
    const advCount = unitAdvIds.length;
    return {
      ...unit,
      adventurersCount: advCount,
      specialtiesCount: specsCount,
    };
  }).sort((a, b) => b.specialtiesCount - a.specialtiesCount);

  // Total stars in the constellation
  const maxUnitSpecs = Math.max(...unitStats.map(u => u.specialtiesCount), 1);

  // Copy text helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      
      {/* Read-Only Notice for Regular Directors */}
      {!canEdit && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-amber-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Modo Somente Leitura</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Você está conectado como Diretor(a). Para editar ou lançar registros, solicite liberação ao Instrutor Admin.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
            Apenas Consulta
          </span>
        </div>
      )}

      {/* HERO BANNER - Stunning "Céu Estrelado" Concept */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E0B36] via-[#2A104E] to-[#451475] p-6 sm:p-8 text-white shadow-xl shadow-purple-950/20 border border-purple-800/40">
        
        {/* Starry night sky simulated background particles */}
        <div className="absolute top-4 right-10 w-2 h-2 bg-amber-300 rounded-full blur-[0.5px] animate-pulse" />
        <div className="absolute top-12 right-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-70" />
        <div className="absolute bottom-6 right-1/3 w-2.5 h-2.5 bg-amber-400 rounded-full blur-[1px] animate-ping opacity-50" />
        <div className="absolute top-1/2 right-16 w-3 h-3 bg-amber-300/40 rounded-full blur-sm" />
        <div className="absolute top-8 left-1/3 w-1.5 h-1.5 bg-amber-200 rounded-full opacity-80" />
        
        {/* Subtle celestial radial glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Constelação do Clube 2026</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
              Clube {clubSettings?.clubName || 'Herança do Céu'}
            </h1>
            
            <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
              Bem-vindo(a), <span className="text-amber-300 font-bold">{currentUser?.name}</span>. Acompanhe em tempo real as especialidades conquistadas, provas e o avanço de cada aventureiro rumo à sua insígnia.
            </p>

            <div className="pt-2 flex items-center space-x-2 text-xs text-amber-200/90 font-serif italic">
              <span>"{clubSettings?.clubMotto || 'Por amor a Jesus, farei sempre o meu melhor!'}"</span>
            </div>
          </div>

          {/* Quick Action Button Group */}
          {canEdit && (
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <button
                onClick={onOpenNewSpecialty}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
              >
                <Star className="w-4 h-4 fill-purple-950" />
                <span>Lançar Especialidade</span>
              </button>
              
              <button
                onClick={onOpenNewAdventurer}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Novo Membro</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BIG METRICS CARDS - High Contrast Mobills-style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Metric 1: Aventureiros */}
        <div 
          onClick={() => onNavigate('adventurers')}
          className="group cursor-pointer bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-purple-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Membros Ativos</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              {totalAdventurers}
            </div>
            <div className="flex items-center text-[11px] font-medium text-slate-500">
              <span>Distribuídos em {units.length} unidades</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-purple-700">
            <span>Ver listagem</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 2: Especialidades Conquistadas (Estrelas) */}
        <div 
          onClick={() => onNavigate('specialties')}
          className="group cursor-pointer bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-amber-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Especialidades Conquistadas</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif flex items-center">
              <span>{totalEarnedSpecialties}</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 ml-1.5 animate-pulse" />
            </div>
            <div className="flex items-center text-[11px] font-medium text-amber-700">
              <Sparkles className="w-3 h-3 mr-1" />
              <span>Estrelas no Céu do Clube</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
            <span>Visão por Unidade</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 3: Provas & Aprovação */}
        <div 
          onClick={() => onNavigate('tests')}
          className="group cursor-pointer bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-emerald-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Provas Realizadas</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              {testRecords.length}
            </div>
            <div className="flex items-center text-[11px] font-medium text-emerald-700">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>{passRate}% de aprovação</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
            <span>Ver resultados</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Metric 4: Próximas Atividades / Cronograma */}
        <div 
          onClick={() => onNavigate('schedule')}
          className="group cursor-pointer bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-blue-200 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Cronograma Ativo</span>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              {scheduleItems.length}
            </div>
            <div className="flex items-center text-[11px] font-medium text-blue-700">
              <Clock className="w-3 h-3 mr-1" />
              <span>Eventos programados</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
            <span>Ver calendário</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* TWO COLUMN SECTION: UNIT RANKING (ESTRELAS POR UNIDADE) + WHATSAPP QUICK REMINDER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col (2/3): "Estrelas do Céu por Unidade" (Ranking e Especialidades Agrupadas) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2 font-serif">
                <span>Constelações por Unidade</span>
                <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Total de Conquistas
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quantidade total de especialidades já conquistadas por cada turma
              </p>
            </div>

            <button
              onClick={() => onNavigate('specialties')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center"
            >
              <span>Detalhes</span>
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          {/* Units Progress Bars */}
          <div className="space-y-4">
            {unitStats.map((u, idx) => {
              const percentage = Math.round((u.specialtiesCount / maxUnitSpecs) * 100);
              return (
                <div key={u.id} className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{u.symbol}</span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-800">{u.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 font-medium border border-slate-200">
                            {u.ageRange}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Conselheiro(a): {u.counselorName} • {u.adventurersCount} membros
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-extrabold text-purple-950 flex items-center justify-end space-x-1">
                        <span>{u.specialtiesCount}</span>
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">estrelas ganhas</span>
                    </div>
                  </div>

                  {/* Clean Visual Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-purple-700 to-amber-400"
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (1/3): Próximo Lembrete / Comunicado com 1-Click WhatsApp */}
        <div className="bg-gradient-to-b from-purple-900 to-[#1F0A38] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-purple-800/60 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Lembrete WhatsApp</span>
              </div>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30 font-medium">
                Pronto para envio
              </span>
            </div>

            {nextReminder ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-purple-950/60 border border-purple-800/80 text-xs font-sans whitespace-pre-line text-purple-100 max-h-48 overflow-y-auto leading-relaxed scrollbar-thin">
                  {nextReminder.formattedText}
                </div>

                <div className="space-y-1.5 text-[11px] text-purple-300">
                  <p className="flex items-center">
                    <UserIcon className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                    Destino: <strong className="text-white ml-1">{nextReminder.targetGroup || 'Grupo de Pais no WhatsApp'}</strong>
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-purple-300/80 text-xs">
                Nenhum lembrete cadastrado ainda.
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-purple-800/50 space-y-2">
            {nextReminder && (
              <button
                onClick={() => handleCopy(nextReminder.formattedText, nextReminder.id)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
              >
                {copiedId === nextReminder.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-900" />
                    <span className="text-emerald-950">Texto Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-purple-950" />
                    <span>Copiar Mensagem Formatada</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onNavigate('schedule')}
              className="w-full py-2 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-950/70 text-purple-200 text-xs font-medium text-center transition-colors"
            >
              Criar ou ver outros lembretes &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* UPCOMING SCHEDULE & RECENT ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Próximas Especialidades no Cronograma */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2 font-serif">
              <Calendar className="w-4 h-4 text-purple-700" />
              <span>Próximas Reuniões e Especialidades</span>
            </h3>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900"
            >
              Ver Todas ({scheduleItems.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingSchedule.map(item => (
              <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{item.specialtyName}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      {formatDateBR(item.plannedDate)} às {item.time} • {item.responsible}
                    </p>
                    <p className="text-[11px] text-purple-700 mt-1 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-purple-500" />
                      {item.location}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Últimas Conquistas (Feed de Estrelas Registradas) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2 font-serif">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Conquistas Recentes dos Membros</span>
            </h3>
            <button
              onClick={() => onNavigate('specialties')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900"
            >
              Ver Ledger Completo
            </button>
          </div>

          <div className="space-y-2.5">
            {earnedSpecialties.slice(0, 4).map(earned => {
              const adv = adventurers.find(a => a.id === earned.adventurerId);
              return (
                <div key={earned.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{earned.specialtyName}</h4>
                      <p className="text-[11px] text-slate-500">
                        {adv ? adv.name : 'Aventureiro'} • Instrutor(a): {earned.instructorName}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap ml-2">
                    {formatDateBR(earned.completionDate)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
