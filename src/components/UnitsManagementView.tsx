import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Unit } from '../types';
import { 
  FolderTree, 
  Plus, 
  Edit2, 
  Trash2, 
  Users, 
  X, 
  Save, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles,
  Layers
} from 'lucide-react';

const UNIT_SYMBOLS = ['⭐', '🦁', '🦅', '🐻', '🐝', '🌟', '🕊️', '🌿', '🛡️', '☀️', '🔥', '⚓'];
const UNIT_COLORS = [
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-blue-100 text-blue-900 border-blue-300',
  'bg-emerald-100 text-emerald-900 border-emerald-300',
  'bg-purple-100 text-purple-900 border-purple-300',
  'bg-rose-100 text-rose-900 border-rose-300',
  'bg-cyan-100 text-cyan-900 border-cyan-300',
];

interface UnitsManagementViewProps {
  onSelectUnitFilter?: (unitId: string) => void;
}

export const UnitsManagementView: React.FC<UnitsManagementViewProps> = () => {
  const { units, adventurers, addUnit, updateUnit, deleteUnit, canEdit } = useApp();

  // Create / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('⭐');
  const [ageRange, setAgeRange] = useState('6 a 9 anos');
  const [counselor, setCounselor] = useState('');
  const [color, setColor] = useState(UNIT_COLORS[0]);

  const handleOpenNew = () => {
    setEditingUnit(null);
    setName('');
    setSymbol('⭐');
    setAgeRange('6 a 9 anos');
    setCounselor('');
    setColor(UNIT_COLORS[0]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setName(unit.name);
    setSymbol(unit.symbol || '⭐');
    setAgeRange(unit.ageRange || '6 a 9 anos');
    setCounselor(unit.counselorName || '');
    setColor(unit.color || UNIT_COLORS[0]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Por favor, informe o nome da unidade.');
      return;
    }

    if (editingUnit) {
      updateUnit(editingUnit.id, {
        name: name.trim(),
        symbol,
        ageRange,
        counselorName: counselor.trim(),
        color,
      });
    } else {
      addUnit({
        name: name.trim(),
        symbol,
        ageRange,
        counselorName: counselor.trim(),
        color,
      });
    }

    setIsModalOpen(false);
    setEditingUnit(null);
  };

  const handleDelete = (unit: Unit) => {
    const memberCount = adventurers.filter(a => a.unitId === unit.id).length;
    const confirmMsg = memberCount > 0
      ? `Atenção: A unidade "${unit.name}" possui ${memberCount} aventureiro(s) vinculado(s).\n\nTem certeza que deseja excluir esta unidade? Os membros continuarão cadastrados no clube, mas ficarão sem unidade atribuída até você editá-los.`
      : `Tem certeza que deseja excluir a unidade "${unit.name}"? Esta ação removerá a unidade do sistema.`;

    if (window.confirm(confirmMsg)) {
      deleteUnit(unit.id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-[#1F0A38] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Ambient sparkle decor */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-purple-950">
              Diretoria & Instrutores
            </span>
            <span className="text-xs text-purple-300">
              {units.length} unidade(s) cadastradas
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight flex items-center space-x-2.5">
            <FolderTree className="w-6 h-6 text-amber-400" />
            <span>Gerenciamento de Unidades do Clube</span>
          </h2>
          <p className="text-xs text-purple-200 max-w-xl">
            Corrija nomes incorretos, exclua unidades duplicadas ou cadastre as turmas oficiais do Clube de Aventureiros. As alterações são sincronizadas imediatamente em todos os filtros e cadastros.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenNew}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Nova Unidade</span>
          </button>
        )}
      </div>

      {/* Warning Notice Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-900 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">Controle Total das Turmas / Unidades:</strong>
          <p className="text-amber-800 mt-0.5">
            Você pode corrigir nomes grafados incorretamente clicando no botão <strong>"Editar"</strong> ao lado de cada unidade, ou remover unidades erradas com o botão <strong>"Excluir"</strong>.
          </p>
        </div>
      </div>

      {/* Units List Grid */}
      {units.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm space-y-3">
          <FolderTree className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">Nenhuma unidade cadastrada no clube</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cadastre as unidades oficiais dos aventureiros clicando no botão acima.
          </p>
          {canEdit && (
            <button
              onClick={handleOpenNew}
              className="px-4 py-2 rounded-xl bg-purple-900 text-white font-bold text-xs hover:bg-purple-950 transition-colors"
            >
              Cadastrar Primeira Unidade
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map(unit => {
            const members = adventurers.filter(a => a.unitId === unit.id);

            return (
              <div
                key={unit.id}
                className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Symbol & Members Count */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-2xl shadow-inner">
                        {unit.symbol || '⭐'}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 font-serif leading-tight">
                          {unit.name}
                        </h3>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Faixa: {unit.ageRange || '6 a 9 anos'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-100/80 text-purple-900 text-xs font-bold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{members.length}</span>
                    </div>
                  </div>

                  {/* Counselor Info */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Conselheiro(a):</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                        {unit.counselorName || 'Não informado'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar: EDIT and DELETE buttons (VERY PROMINENT) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    ID: {unit.id.substring(0, 10)}...
                  </span>

                  {canEdit && (
                    <div className="flex items-center space-x-2">
                      {/* EDIT BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(unit)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                        title="Editar nome ou dados da unidade"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-purple-700" />
                        <span>Editar</span>
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        type="button"
                        onClick={() => handleDelete(unit)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center space-x-1.5 border border-rose-200 hover:border-rose-300 transition-colors cursor-pointer"
                        title="Excluir unidade do sistema"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>Excluir</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: CREATE OR EDIT UNIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 my-auto text-slate-900 relative">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-[#1F0A38] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-amber-400 text-purple-950">
                  <FolderTree className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-serif">
                    {editingUnit ? 'Editar Unidade' : 'Cadastrar Nova Unidade'}
                  </h3>
                  <p className="text-xs text-purple-200">
                    {editingUnit ? 'Altere o nome e configurações da unidade' : 'Defina os dados da nova turma'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-purple-200 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Unidade <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ex: Abelhinhas, Luminares, Guardiões da Fé..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Símbolo / Ícone
                  </label>
                  <select
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
                  >
                    {UNIT_SYMBOLS.map(s => (
                      <option key={s} value={s}>{s} Símbolo {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Faixa Etária
                  </label>
                  <input
                    type="text"
                    placeholder="ex: 6 a 7 anos"
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Conselheiro(a) Responsável
                </label>
                <input
                  type="text"
                  placeholder="ex: Tio Marcos / Tia Ana"
                  value={counselor}
                  onChange={(e) => setCounselor(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>{editingUnit ? 'Salvar Alterações' : 'Criar Unidade'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
