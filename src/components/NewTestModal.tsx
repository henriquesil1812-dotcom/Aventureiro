import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TestResultType, TestStatus } from '../types';
import { X, FileCheck2 } from 'lucide-react';

interface NewTestModalProps {
  preselectedAdventurerId?: string;
  onClose: () => void;
}

export const NewTestModal: React.FC<NewTestModalProps> = ({
  preselectedAdventurerId,
  onClose,
}) => {
  const { adventurers, addTestRecord, currentUser } = useApp();

  const [adventurerId, setAdventurerId] = useState(preselectedAdventurerId || adventurers[0]?.id || '');
  const [testName, setTestName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [resultType, setResultType] = useState<TestResultType>('status');
  const [status, setStatus] = useState<TestStatus>('Aprovado');
  const [numericScore, setNumericScore] = useState<number>(10);
  const [maxScore, setMaxScore] = useState<number>(10);
  const [examinerName, setExaminerName] = useState(currentUser?.name || '');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !adventurerId || !examinerName.trim()) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    addTestRecord({
      adventurerId,
      testName: testName.trim(),
      date,
      resultType,
      status: resultType === 'status' ? status : (numericScore >= 7 ? 'Aprovado' : 'Reprovado'),
      numericScore: resultType === 'numeric' ? Number(numericScore) : undefined,
      maxScore: resultType === 'numeric' ? Number(maxScore) : undefined,
      examinerName: examinerName.trim(),
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl text-slate-900 relative my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-purple-950 mb-4">
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-serif">Registrar Avaliação / Prova</h3>
            <p className="text-xs text-slate-500">Lançamento de testes práticos, teóricos ou de classe</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome da Prova / Teste <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ex: Prova Prática de Nós e Amarras"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Aventureiro Avaliado <span className="text-rose-500">*</span>
              </label>
              <select
                value={adventurerId}
                onChange={(e) => setAdventurerId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                {adventurers.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.currentClass})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de Realização <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          {/* Result Type Selection */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800">Formato do Resultado</label>
              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={() => setResultType('status')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    resultType === 'status' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Status (Aprovado / Reprovado)
                </button>
                <button
                  type="button"
                  onClick={() => setResultType('numeric')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    resultType === 'numeric' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Nota Numérica
                </button>
              </div>
            </div>

            {resultType === 'status' ? (
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Aprovado'}
                    onChange={() => setStatus('Aprovado')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Aprovado
                  </span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Reprovado'}
                    onChange={() => setStatus('Reprovado')}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    Reprovado
                  </span>
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nota Obtida</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="10"
                    value={numericScore}
                    onChange={(e) => setNumericScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nota Máxima</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 font-bold text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instrutor / Examinador <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="ex: Instrutor João Paulo"
              value={examinerName}
              onChange={(e) => setExaminerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações do Teste
            </label>
            <textarea
              rows={2}
              placeholder="ex: Demonstrou rapidez e domínio na execução prática."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-purple-900 text-white text-xs font-bold hover:bg-purple-950 transition-all shadow-md"
            >
              Lançar Resultado da Prova
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
