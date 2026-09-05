import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpecialtyCategory, EarnedSpecialty } from '../types';
import { 
  Award, 
  Star, 
  Plus, 
  Search, 
  Calendar, 
  Users, 
  Sparkles, 
  Trash2, 
  BookOpen, 
  Layers, 
  Filter,
  CheckCircle2,
  X,
  Edit2,
  Save
} from 'lucide-react';
import { formatDateBR } from '../utils/formatters';

interface SpecialtiesViewProps {
  onOpenAwardModal: () => void;
}

export const SpecialtiesView: React.FC<SpecialtiesViewProps> = ({ onOpenAwardModal }) => {
  const { 
    units, 
    adventurers, 
    specialtiesCatalog, 
    earnedSpecialties, 
    updateEarnedSpecialty,
    deleteEarnedSpecialty, 
    addCatalogSpecialty,
    updateCatalogSpecialty,
    deleteCatalogSpecialty,
    specialtyCategories,
    canEdit,
    isInstructor
  } = useApp();

  const [activeTab, setActiveTab] = useState<'units' | 'ledger' | 'catalog'>('units');
  const [searchLedger, setSearchLedger] = useState('');
  const [selectedUnitLedger, setSelectedUnitLedger] = useState('ALL');
  const [selectedCategoryLedger, setSelectedCategoryLedger] = useState('ALL');
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [searchCatalog, setSearchCatalog] = useState('');
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState('ALL');

  // Edit catalog item state
  const [editingCatalogId, setEditingCatalogId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatCategory, setEditCatCategory] = useState('');
  const [editCatDesc, setEditCatDesc] = useState('');
  const [editCatReqCount, setEditCatReqCount] = useState(5);

  // New catalog item form state
  const [catName, setCatName] = useState('');
  const [catCategory, setCatCategory] = useState<SpecialtyCategory>(specialtyCategories[0] || 'Natureza');
  const [catDesc, setCatDesc] = useState('');
  const [catReqCount, setCatReqCount] = useState(5);

  // Edit earned specialty state
  const [editingEarnedItem, setEditingEarnedItem] = useState<EarnedSpecialty | null>(null);
  const [editEarnedInstructor, setEditEarnedInstructor] = useState('');
  const [editEarnedDate, setEditEarnedDate] = useState('');
  const [editEarnedNotes, setEditEarnedNotes] = useState('');

  const handleStartEditEarned = (item: EarnedSpecialty) => {
    setEditingEarnedItem(item);
    setEditEarnedInstructor(item.instructorName);
    setEditEarnedDate(item.completionDate);
    setEditEarnedNotes(item.notes || '');
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

  // Grouped by Unit data
  const unitSummaries = units.map(u => {
    const members = adventurers.filter(a => a.unitId === u.id);
    const memberIds = members.map(m => m.id);
    const earned = earnedSpecialties.filter(e => memberIds.includes(e.adventurerId));

    // Distribution by specialty category for this unit
    const categoryCount: Record<string, number> = {};
    earned.forEach(e => {
      categoryCount[e.category] = (categoryCount[e.category] || 0) + 1;
    });

    return {
      unit: u,
      members,
      earned,
      starsCount: earned.length,
      categoryCount,
    };
  }).sort((a, b) => b.starsCount - a.starsCount);

  const totalClubStars = earnedSpecialties.length;

  // Filtered ledger
  const filteredLedger = earnedSpecialties.filter(item => {
    const adv = adventurers.find(a => a.id === item.adventurerId);
    const matchesSearch = item.specialtyName.toLowerCase().includes(searchLedger.toLowerCase()) ||
      item.instructorName.toLowerCase().includes(searchLedger.toLowerCase()) ||
      (adv ? adv.name.toLowerCase().includes(searchLedger.toLowerCase()) : false);
    const matchesUnit = selectedUnitLedger === 'ALL' || (adv && adv.unitId === selectedUnitLedger);
    const matchesCategory = selectedCategoryLedger === 'ALL' || item.category === selectedCategoryLedger;
    return matchesSearch && matchesUnit && matchesCategory;
  });

  // Filtered catalog
  const filteredCatalog = specialtiesCatalog.filter(spec => {
    const matchesSearch = spec.name.toLowerCase().includes(searchCatalog.toLowerCase()) ||
      spec.description.toLowerCase().includes(searchCatalog.toLowerCase());
    const matchesCategory = selectedCatalogCategory === 'ALL' || spec.category === selectedCatalogCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartEditCatalog = (spec: { id: string; name: string; category: string; description: string; requirementsCount: number }) => {
    setEditingCatalogId(spec.id);
    setEditCatName(spec.name);
    setEditCatCategory(spec.category);
    setEditCatDesc(spec.description);
    setEditCatReqCount(spec.requirementsCount || 5);
  };

  const handleSaveEditCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCatalogId) return;
    updateCatalogSpecialty(editingCatalogId, {
      name: editCatName.trim(),
      category: editCatCategory,
      description: editCatDesc.trim(),
      requirementsCount: Number(editCatReqCount) || 5,
    });
    setEditingCatalogId(null);
  };

  const handleCreateCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addCatalogSpecialty({
      name: catName.trim(),
      category: catCategory,
      description: catDesc.trim(),
      requirementsCount: Number(catReqCount) || 5,
    });
    setCatName('');
    setCatDesc('');
    setShowCatalogModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif flex items-center space-x-2">
            <span>Controle de Especialidades</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
              {totalClubStars} Estrelas Totais
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registro de conquistas, visão agrupada por unidade e catálogo oficial
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowCatalogModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-700" />
              <span>+ Nova no Catálogo</span>
            </button>

            <button
              onClick={onOpenAwardModal}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Star className="w-4 h-4 fill-purple-950" />
              <span>Lançar Conquista</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Tabs */}
      <div className="flex items-center space-x-2 bg-slate-200/70 p-1 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('units')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'units'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Visão por Unidade ({units.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ledger'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Histórico Conquistadas ({earnedSpecialties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'catalog'
              ? 'bg-white text-purple-950 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catálogo do Clube ({specialtiesCatalog.length})</span>
        </button>
      </div>

      {/* TAB 1: VISÃO AGRUPADA POR UNIDADE */}
      {activeTab === 'units' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {unitSummaries.map(({ unit, members, earned, starsCount, categoryCount }) => (
              <div 
                key={unit.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Unit Header */}
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-2xl flex items-center justify-center shadow-inner">
                        {unit.symbol}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 font-serif">{unit.name}</h3>
                        <p className="text-xs text-slate-500">
                          Conselheiro(a): <strong>{unit.counselorName}</strong> • {unit.ageRange}
                        </p>
                      </div>
                    </div>

                    <div className="text-right bg-amber-50 px-3 py-1.5 rounded-2xl border border-amber-200">
                      <div className="flex items-center justify-end space-x-1 text-amber-700">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span className="text-xl font-extrabold font-serif">{starsCount}</span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-medium">conquistadas</span>
                    </div>
                  </div>

                  {/* Members breakdown */}
                  <div className="py-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
                      <span>Membros da Unidade ({members.length})</span>
                      <span className="text-slate-400">Estrelas</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      {members.map(m => {
                        const mSpecs = earned.filter(e => e.adventurerId === m.id);
                        return (
                          <div key={m.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs">
                            <span className="font-medium text-slate-800">{m.name}</span>
                            <span className="inline-flex items-center font-bold text-amber-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                              {mSpecs.length}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Categories badges */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {Object.entries(categoryCount).map(([cat, count]) => (
                    <span key={cat} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-100">
                      {cat}: {count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HISTÓRICO COMPLETO DE CONQUISTAS */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          {/* Filters toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchLedger}
                onChange={(e) => setSearchLedger(e.target.value)}
                placeholder="Buscar por especialidade, aventureiro ou instrutor..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <select
                value={selectedUnitLedger}
                onChange={(e) => setSelectedUnitLedger(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="ALL">Todas as Unidades</option>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.symbol} {u.name}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedCategoryLedger}
                onChange={(e) => setSelectedCategoryLedger(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="ALL">Todas as Áreas / Categorias</option>
                {specialtyCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table / Cards Ledger */}
          {filteredLedger.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border border-slate-100 text-xs text-slate-500">
              Nenhuma especialidade encontrada com os filtros selecionados.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Especialidade Conquistada</th>
                      <th className="py-3 px-4">Aventureiro</th>
                      <th className="py-3 px-4">Unidade</th>
                      <th className="py-3 px-4">Data de Conclusão</th>
                      <th className="py-3 px-4">Instrutor / Avaliador</th>
                      {canEdit && <th className="py-3 px-4 text-right">Ação</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLedger.map(item => {
                      const adv = adventurers.find(a => a.id === item.adventurerId);
                      const unit = units.find(u => u.id === adv?.unitId);
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center space-x-2">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                            <div>
                              <span>{item.specialtyName}</span>
                              <span className="block text-[10px] font-normal text-slate-400">{item.category}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-purple-900">
                            {adv ? adv.name : 'Desconhecido'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {unit ? `${unit.symbol} ${unit.name}` : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {formatDateBR(item.completionDate)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 font-medium">
                            {item.instructorName}
                          </td>
                          {canEdit && (
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditEarned(item)}
                                  className="text-purple-700 hover:bg-purple-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Editar lançamento da especialidade"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Remover especialidade "${item.specialtyName}" de ${adv?.name}?`)) {
                                      deleteEarnedSpecialty(item.id);
                                    }
                                  }}
                                  className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir lançamento"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CATÁLOGO DE ESPECIALIDADES */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Catalog Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchCatalog}
                onChange={(e) => setSearchCatalog(e.target.value)}
                placeholder="Buscar no catálogo por nome ou descrição..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <select
                value={selectedCatalogCategory}
                onChange={(e) => setSelectedCatalogCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="ALL">Todas as Categorias ({specialtiesCatalog.length})</option>
                {specialtyCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredCatalog.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border border-slate-100 text-xs text-slate-500">
              Nenhuma especialidade encontrada no catálogo com os critérios de busca.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map(spec => (
                <div key={spec.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-100">
                        {spec.category}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {spec.requirementsCount} requisitos
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 font-serif">{spec.name}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {spec.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="flex items-center font-semibold text-amber-700">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                      Insígnia Oficial
                    </span>

                    {canEdit && (
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleStartEditCatalog(spec)}
                          className="px-2 py-1 text-[11px] text-purple-700 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Deseja remover "${spec.name}" do catálogo do clube?`)) {
                              deleteCatalogSpecialty(spec.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Excluir especialidade do catálogo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: EDITAR ESPECIALIDADE DO CATÁLOGO */}
      {editingCatalogId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setEditingCatalogId(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-serif">Editar Especialidade</h3>
            </div>

            <form onSubmit={handleSaveEditCatalog} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Especialidade</label>
                <input
                  type="text"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Área / Categoria</label>
                <select
                  value={editCatCategory}
                  onChange={(e) => setEditCatCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                >
                  {specialtyCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição & Requisitos</label>
                <textarea
                  rows={3}
                  value={editCatDesc}
                  onChange={(e) => setEditCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qtd. de Requisitos</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={editCatReqCount}
                  onChange={(e) => setEditCatReqCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCatalogId(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950 cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADICIONAR AO CATÁLOGO */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setShowCatalogModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg font-serif">Nova Especialidade no Catálogo</h3>
            </div>

            <form onSubmit={handleCreateCatalogItem} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Especialidade</label>
                <input
                  type="text"
                  placeholder="ex: Jardinagem Mirim"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Área / Categoria</label>
                <select
                  value={catCategory}
                  onChange={(e) => setCatCategory(e.target.value as SpecialtyCategory)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                >
                  {specialtyCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição & Requisitos</label>
                <textarea
                  rows={3}
                  placeholder="Resumo dos objetivos e requisitos da especialidade..."
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qtd. de Requisitos</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={catReqCount}
                  onChange={(e) => setCatReqCount(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950"
                >
                  Adicionar ao Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR ESPECIALIDADE CONQUISTADA */}
      {editingEarnedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
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
                <h3 className="font-bold text-lg font-serif">Editar Lançamento</h3>
                <p className="text-xs text-slate-500">{editingEarnedItem.specialtyName} ({editingEarnedItem.category})</p>
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
                  placeholder="Anotações sobre a conclusão ou desempenho..."
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

    </div>
  );
};
