import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TestRecord } from '../types';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Users,
  Edit2,
  X,
  Save
} from 'lucide-react';
import { formatDateBR } from '../utils/formatters';

interface TestsViewProps {
  onOpenNewTest: () => void;
}

export const TestsView: React.FC<TestsViewProps> = ({ onOpenNewTest }) => {
  const { testRecords, adventurers, units, deleteTestRecord, updateTestRecord, canEdit } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Edit Test Record state
  const [editingTest, setEditingTest] = useState<TestRecord | null>(null);
  const [editScore, setEditScore] = useState<number>(10);
  const [editStatus, setEditStatus] = useState<'Aprovado' | 'Reprovado'>('Aprovado');
  const [editNotes, setEditNotes] = useState<string>('');

  const totalTests = testRecords.length;
  const approvedCount = testRecords.filter(t => t.status === 'Aprovado' || (t.numericScore && t.numericScore >= 7)).length;
  const reprovedCount = totalTests - approvedCount;
  const passRate = totalTests > 0 ? Math.round((approvedCount / totalTests) * 100) : 100;

  const handleStartEditTest = (test: TestRecord) => {
    setEditingTest(test);
    setEditScore(test.numericScore ?? 10);
    setEditStatus(test.status === 'Aprovado' ? 'Aprovado' : 'Reprovado');
    setEditNotes(test.notes || '');
  };

  const handleSaveEditTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTest) return;
    updateTestRecord(editingTest.id, {
      numericScore: Number(editScore),
      status: editingTest.resultType === 'numeric' 
        ? (Number(editScore) >= 7 ? 'Aprovado' : 'Reprovado')
        : editStatus,
      notes: editNotes.trim(),
    });
    setEditingTest(null);
  };

  const filteredTests = testRecords.filter(t => {
    const adv = adventurers.find(a => a.id === t.adventurerId);
    const matchesSearch = t.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.examinerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (adv ? adv.name.toLowerCase().includes(searchQuery.toLowerCase()) : false);
    
    const isApproved = t.status === 'Aprovado' || (t.numericScore && t.numericScore >= 7);
    const matchesStatus = filterStatus === 'ALL' || 
      (filterStatus === 'APROVADO' && isApproved) || 
      (filterStatus === 'REPROVADO' && !isApproved);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif flex items-center space-x-2">
            <span>Registro de Provas e Testes</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {totalTests} Avaliações
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Histórico das provas teóricas, práticas e orais aplicadas no clube
          </p>
        </div>

        {canEdit && (
          <button
            onClick={onOpenNewTest}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold shadow-md shadow-purple-900/20 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Registrar Nova Prova</span>
          </button>
        )}
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Aplicadas</span>
          <span className="text-2xl font-black text-slate-900 font-serif">{totalTests}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[11px] font-semibold text-emerald-600 block flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" /> Aprovados
          </span>
          <span className="text-2xl font-black text-emerald-700 font-serif">{approvedCount}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[11px] font-semibold text-rose-600 block flex items-center">
            <XCircle className="w-3 h-3 mr-1" /> Reprovações
          </span>
          <span className="text-2xl font-black text-rose-700 font-serif">{reprovedCount}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[11px] font-semibold text-purple-700 block flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Índice de Sucesso
          </span>
          <span className="text-2xl font-black text-purple-950 font-serif">{passRate}%</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome da prova, aventureiro ou examinador..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        <div className="sm:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
          >
            <option value="ALL">Todos os Resultados</option>
            <option value="APROVADO">Aprovados</option>
            <option value="REPROVADO">Reprovados</option>
          </select>
        </div>
      </div>

      {/* Tests Table / List */}
      {filteredTests.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl text-center border border-slate-100 shadow-sm space-y-2">
          <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">Nenhum teste encontrado</h4>
          <p className="text-xs text-slate-500">Ajuste os filtros de busca ou cadastre uma nova avaliação.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Prova / Teste</th>
                  <th className="py-3.5 px-4">Aventureiro</th>
                  <th className="py-3.5 px-4">Data</th>
                  <th className="py-3.5 px-4">Resultado</th>
                  <th className="py-3.5 px-4">Avaliador</th>
                  {canEdit && <th className="py-3.5 px-4 text-right">Ação</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTests.map(test => {
                  const adv = adventurers.find(a => a.id === test.adventurerId);
                  const isApproved = test.status === 'Aprovado' || (test.numericScore && test.numericScore >= 7);
                  return (
                    <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{test.testName}</div>
                        {test.notes && <div className="text-[11px] text-slate-400 italic">"{test.notes}"</div>}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-purple-900">
                        {adv ? adv.name : 'Desconhecido'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDateBR(test.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isApproved 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {isApproved ? (
                            <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3 h-3 mr-1 text-rose-600" />
                          )}
                          {test.resultType === 'numeric' 
                            ? `Nota ${test.numericScore}/${test.maxScore || 10}` 
                            : test.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {test.examinerName}
                      </td>
                      {canEdit && (
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleStartEditTest(test)}
                              className="text-purple-700 hover:bg-purple-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Editar nota ou avaliação"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Deseja excluir o registro da prova "${test.testName}"?`)) {
                                  deleteTestRecord(test.id);
                                }
                              }}
                              className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Excluir prova"
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

      {/* MODAL: EDITAR PROVA */}
      {editingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-900 relative">
            <button
              onClick={() => setEditingTest(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-purple-950 mb-4">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base font-serif">Editar Avaliação</h3>
                <p className="text-xs text-slate-500">{editingTest.testName}</p>
              </div>
            </div>

            <form onSubmit={handleSaveEditTest} className="space-y-4">
              {editingTest.resultType === 'numeric' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nota Numérica (0 a 10)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.5}
                    value={editScore}
                    onChange={(e) => setEditScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Notas iguais ou superiores a 7,0 indicam aprovação.</p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Situação / Resultado
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as 'Aprovado' | 'Reprovado')}
                    className="w-full px-3 py-2 text-sm bg-slate-50 rounded-xl border border-slate-200"
                  >
                    <option value="Aprovado">Aprovado</option>
                    <option value="Reprovado">Reprovado</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parecer do Avaliador / Observações
                </label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Comentários sobre o desempenho na prova..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950 flex items-center space-x-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Avaliação</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
