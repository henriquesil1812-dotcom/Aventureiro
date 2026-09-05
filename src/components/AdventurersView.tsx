import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Adventurer, AdventurerClass, Unit } from '../types';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Star, 
  Settings2, 
  Users, 
  Phone, 
  Sparkles, 
  ChevronRight, 
  X,
  Printer,
  Edit2,
  Trash2,
  FolderTree
} from 'lucide-react';
import { exportAdventurersCSV } from '../utils/formatters';
import { EditAdventurerModal } from './EditAdventurerModal';

interface AdventurersViewProps {
  onSelectAdventurer: (adventurer: Adventurer) => void;
  onOpenNewAdventurer: () => void;
  onOpenPrintReport: () => void;
}

export const AdventurersView: React.FC<AdventurersViewProps> = ({
  onSelectAdventurer,
  onOpenNewAdventurer,
  onOpenPrintReport,
}) => {
  const { 
    adventurers, 
    units, 
    earnedSpecialties, 
    testRecords, 
    classRequirements, 
    classProgress, 
    canEdit,
    isInstructor,
    deleteAdventurer,
    setCurrentTab,
    addUnit,
    updateUnit,
    deleteUnit
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>('ALL');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');
  const [showUnitsModal, setShowUnitsModal] = useState(false);
  const [editingAdventurer, setEditingAdventurer] = useState<Adventurer | null>(null);

  // Edit unit state in modal
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);
  const [editUnitName, setEditUnitName] = useState('');
  const [editCounselor, setEditCounselor] = useState('');
  const [editAgeRange, setEditAgeRange] = useState('');
  const [editSymbol, setEditSymbol] = useState('');
  const [editColor, setEditColor] = useState('#8B5CF6');

  // New unit form state inside units modal
  const [newUnitName, setNewUnitName] = useState('');
  const [newCounselor, setNewCounselor] = useState('');
  const [newAgeRange, setNewAgeRange] = useState('');
  const [newSymbol, setNewSymbol] = useState('⭐');
  const [newColor, setNewColor] = useState('#8B5CF6');

  // Filtered list
  const filteredAdventurers = adventurers.filter(adv => {
    const matchesSearch = adv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adv.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUnit = selectedUnitFilter === 'ALL' || adv.unitId === selectedUnitFilter;
    const matchesClass = selectedClassFilter === 'ALL' || adv.currentClass === selectedClassFilter;
    return matchesSearch && matchesUnit && matchesClass;
  });

  const handleExportCSV = () => {
    exportAdventurersCSV(adventurers, units, earnedSpecialties, testRecords);
  };

  const handleStartEditUnit = (u: Unit) => {
    setEditingUnitId(u.id);
    setEditUnitName(u.name);
    setEditCounselor(u.counselorName);
    setEditAgeRange(u.ageRange);
    setEditSymbol(u.symbol);
    setEditColor(u.color);
  };

  const handleSaveUnitInline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUnitId) return;
    updateUnit(editingUnitId, {
      name: editUnitName.trim(),
      counselorName: editCounselor.trim(),
      ageRange: editAgeRange.trim(),
      symbol: editSymbol.trim() || '⭐',
      color: editColor
    });
    setEditingUnitId(null);
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) return;
    addUnit({
      name: newUnitName.trim(),
      counselorName: newCounselor.trim() || 'A definir',
      ageRange: newAgeRange.trim() || '6 a 9 anos',
      color: newColor || '#8B5CF6',
      symbol: newSymbol || '⭐',
    });
    setNewUnitName('');
    setNewCounselor('');
    setNewAgeRange('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif flex items-center space-x-2">
            <span>Aventureiros do Clube</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {filteredAdventurers.length} de {adventurers.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerencie o cadastro, progresso individual e especialidades de cada membro
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenPrintReport}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-all"
            title="Visualizar e Imprimir Relatório"
          >
            <Printer className="w-3.5 h-3.5 text-purple-700" />
            <span className="hidden xs:inline">Imprimir Relatório</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-all"
            title="Exportar planilha Excel / CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden xs:inline">Exportar CSV</span>
          </button>

          {canEdit && (
            <button
              onClick={() => setCurrentTab ? setCurrentTab('units') : setShowUnitsModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 text-xs font-bold transition-all cursor-pointer border border-purple-200 shadow-sm"
              title="Gerenciar, editar e cadastrar unidades do clube"
            >
              <FolderTree className="w-3.5 h-3.5 text-purple-800" />
              <span>Unidades ({units.length})</span>
            </button>
          )}

          {canEdit && (
            <button
              onClick={onOpenNewAdventurer}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-md shadow-purple-900/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Novo Aventureiro</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH AND FILTER TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Real-time search bar */}
          <div className="relative sm:col-span-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome do aventureiro ou responsável..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Unit Filter */}
          <div>
            <select
              value={selectedUnitFilter}
              onChange={(e) => setSelectedUnitFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium text-slate-700"
            >
              <option value="ALL">Todas as Unidades ({units.length})</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.symbol} {u.name} ({u.ageRange})
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div>
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium text-slate-700"
            >
              <option value="ALL">Todas as Classes</option>
              <option value="Abelhinhas Laboriosas">Abelhinhas Laboriosas (6 anos)</option>
              <option value="Luminares">Luminares (7 anos)</option>
              <option value="Edificadores">Edificadores (8 anos)</option>
              <option value="Mãos Ajudadoras">Mãos Ajudadoras (9 anos)</option>
            </select>
          </div>

        </div>
      </div>

      {/* ADVENTURERS CARD GRID */}
      {filteredAdventurers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Nenhum aventureiro encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Nenhum membro corresponde aos filtros de busca atuais. Tente limpar os filtros ou cadastre um novo aventureiro.
          </p>
          {(searchQuery || selectedUnitFilter !== 'ALL' || selectedClassFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedUnitFilter('ALL');
                setSelectedClassFilter('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-purple-100 text-purple-900 font-semibold text-xs hover:bg-purple-200 transition-colors"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAdventurers.map(adv => {
            const unit = units.find(u => u.id === adv.unitId);
            const mySpecs = earnedSpecialties.filter(e => e.adventurerId === adv.id);
            const classReqs = classRequirements.filter(r => r.className === adv.currentClass);
            const completedIds = classProgress[adv.id] || [];
            const completedCount = classReqs.filter(r => completedIds.includes(r.id)).length;
            const progress = classReqs.length > 0 ? Math.round((completedCount / classReqs.length) * 100) : 0;

            return (
              <div
                key={adv.id}
                onClick={() => onSelectAdventurer(adv)}
                className="group cursor-pointer bg-white rounded-3xl p-4 sm:p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Photo, Name & Unit */}
                  <div className="flex items-start space-x-3.5 mb-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-purple-900 flex-shrink-0 border border-amber-300/80 shadow-sm">
                      {adv.photoUrl ? (
                        <img src={adv.photoUrl} alt={adv.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-amber-300">
                          {adv.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-center text-amber-300 font-bold">
                        {adv.age}a
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 truncate max-w-[140px]">
                          {adv.currentClass}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span className="text-[11px] font-extrabold">{mySpecs.length}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 mt-1 truncate group-hover:text-purple-950 transition-colors">
                        {adv.name}
                      </h3>

                      <p className="text-[11px] text-slate-500 flex items-center mt-0.5">
                        <span className="mr-1">{unit?.symbol || '⭐'}</span>
                        <span className="truncate">{unit?.name || 'Sem unidade'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Responsible Contact Info */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 mb-3 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Responsável:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[130px]">{adv.parentName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">WhatsApp:</span>
                      <span className="font-mono text-purple-900 font-semibold">{adv.parentPhone}</span>
                    </div>
                  </div>

                  {/* Class Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-medium">Progresso de Classe</span>
                      <span className="font-bold text-purple-900">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-purple-700 to-amber-400"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Bottom CTA & Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center text-xs font-semibold text-purple-700 hover:text-purple-950 transition-colors">
                    <span>Ver perfil</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ml-0.5" />
                  </div>

                  {canEdit && (
                    <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAdventurer(adv);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold flex items-center space-x-1 transition-colors border border-purple-100 cursor-pointer"
                        title="Editar dados e foto deste aventureiro"
                      >
                        <Edit2 className="w-3 h-3 text-purple-700" />
                        <span>Editar</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Tem certeza que deseja excluir o aventureiro "${adv.name}"? Todos os registros de especialidades e provas vinculados serão apagados permanentemente.`)) {
                            deleteAdventurer(adv.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors border border-rose-200 cursor-pointer"
                        title="Excluir aventureiro"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MANAGE UNITS MODAL */}
      {showUnitsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-900 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUnitsModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif">Gerenciar Unidades / Turmas</h3>
                <p className="text-xs text-slate-500">Adicione ou edite as turmas do clube</p>
              </div>
            </div>

            {/* List Existing Units */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Unidades Atuais:
              </label>
              {units.map(u => {
                const count = adventurers.filter(a => a.unitId === u.id).length;
                const isEditingThis = editingUnitId === u.id;

                if (isEditingThis) {
                  return (
                    <form key={u.id} onSubmit={handleSaveUnitInline} className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600">Nome da Unidade</label>
                          <input
                            type="text"
                            value={editUnitName}
                            onChange={(e) => setEditUnitName(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white rounded-lg border border-slate-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600">Conselheiro(a)</label>
                          <input
                            type="text"
                            value={editCounselor}
                            onChange={(e) => setEditCounselor(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white rounded-lg border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600">Faixa Etária</label>
                          <input
                            type="text"
                            value={editAgeRange}
                            onChange={(e) => setEditAgeRange(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white rounded-lg border border-slate-300"
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[10px] font-bold text-slate-600">Emoji</label>
                            <input
                              type="text"
                              value={editSymbol}
                              onChange={(e) => setEditSymbol(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs bg-white rounded-lg border border-slate-300"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600">Cor</label>
                            <input
                              type="color"
                              value={editColor}
                              onChange={(e) => setEditColor(e.target.value)}
                              className="w-10 h-7 p-0.5 bg-white rounded-lg border border-slate-300"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingUnitId(null)}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 rounded-lg"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs bg-purple-900 text-white font-bold rounded-lg hover:bg-purple-950"
                        >
                          Salvar
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div key={u.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{u.symbol}</span>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{u.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          Conselheiro(a): {u.counselorName} • {u.ageRange} ({count} membros)
                        </p>
                      </div>
                    </div>

                    {isInstructor && (
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditUnit(u)}
                          className="text-purple-700 hover:bg-purple-50 p-1.5 rounded-lg text-xs"
                          title="Editar unidade"
                        >
                          Editar
                        </button>
                        {units.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Deseja remover a unidade "${u.name}"?`)) {
                                deleteUnit(u.id);
                              }
                            }}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg text-xs"
                            title="Excluir unidade"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Unit Form */}
            {canEdit && (
              <form onSubmit={handleCreateUnit} className="pt-4 border-t border-slate-100 space-y-3">
                <label className="text-xs font-bold text-purple-950 uppercase tracking-wider block">
                  Criar Nova Unidade:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nome da Unidade</label>
                    <input
                      type="text"
                      placeholder="ex: Soldadinhos de Jesus"
                      value={newUnitName}
                      onChange={(e) => setNewUnitName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Conselheiro(a)</label>
                    <input
                      type="text"
                      placeholder="ex: Tia Patrícia"
                      value={newCounselor}
                      onChange={(e) => setNewCounselor(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Faixa Etária</label>
                    <input
                      type="text"
                      placeholder="ex: 6 a 7 anos"
                      value={newAgeRange}
                      onChange={(e) => setNewAgeRange(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Símbolo (Emoji)</label>
                    <input
                      type="text"
                      placeholder="ex: 🕊️ ou ⚡"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-semibold text-xs transition-colors mt-2"
                >
                  Salvar Nova Unidade
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* EDIT ADVENTURER MODAL */}
      {editingAdventurer && (
        <EditAdventurerModal
          adventurer={editingAdventurer}
          onClose={() => setEditingAdventurer(null)}
        />
      )}

    </div>
  );
};
