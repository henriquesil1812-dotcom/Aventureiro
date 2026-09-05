import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SpecialtyCategory } from '../types';
import { X, Star, Sparkles, Check } from 'lucide-react';

interface AwardSpecialtyModalProps {
  preselectedAdventurerId?: string;
  onClose: () => void;
}

export const AwardSpecialtyModal: React.FC<AwardSpecialtyModalProps> = ({
  preselectedAdventurerId,
  onClose,
}) => {
  const { adventurers, specialtiesCatalog, addEarnedSpecialty, currentUser } = useApp();

  const [adventurerId, setAdventurerId] = useState(preselectedAdventurerId || adventurers[0]?.id || '');
  const [selectedCatalogId, setSelectedCatalogId] = useState(specialtiesCatalog[0]?.id || '');
  const [customSpecialtyName, setCustomSpecialtyName] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [category, setCategory] = useState<SpecialtyCategory>('Natureza');
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().slice(0, 10));
  const [instructorName, setInstructorName] = useState(currentUser?.name || '');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adventurerId || !instructorName.trim()) {
      alert('Por favor, selecione o aventureiro e informe o nome do instrutor.');
      return;
    }

    let specName = '';
    let specCat: SpecialtyCategory = 'Natureza';

    if (isCustom) {
      if (!customSpecialtyName.trim()) {
        alert('Informe o nome da especialidade customizada.');
        return;
      }
      specName = customSpecialtyName.trim();
      specCat = category;
    } else {
      const found = specialtiesCatalog.find(s => s.id === selectedCatalogId);
      if (found) {
        specName = found.name;
        specCat = found.category;
      } else {
        specName = 'Especialidade Geral';
      }
    }

    addEarnedSpecialty({
      adventurerId,
      specialtyName: specName,
      category: specCat,
      completionDate,
      instructorName: instructorName.trim(),
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

        <div className="flex items-center space-x-2 text-amber-600 mb-4">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg font-serif text-slate-900">Lançar Especialidade Conquistada</h3>
            <p className="text-xs text-slate-500">Conceda uma nova estrela de conquista ao aventureiro</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Adventurer select */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Aventureiro Conquistador <span className="text-rose-500">*</span>
            </label>
            <select
              value={adventurerId}
              onChange={(e) => setAdventurerId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              required
            >
              {adventurers.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.currentClass})
                </option>
              ))}
            </select>
          </div>

          {/* Specialty from catalog or custom toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Especialidade <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className="text-[11px] text-purple-700 hover:text-purple-900 font-semibold"
              >
                {isCustom ? '← Escolher do Catálogo' : '+ Digitar outra especialidade'}
              </button>
            </div>

            {!isCustom ? (
              <select
                value={selectedCatalogId}
                onChange={(e) => setSelectedCatalogId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              >
                {specialtiesCatalog.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome da especialidade..."
                  value={customSpecialtyName}
                  onChange={(e) => setCustomSpecialtyName(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                  required
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SpecialtyCategory)}
                  className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200"
                >
                  <option value="Natureza">Natureza</option>
                  <option value="Habilidades Manuais">Habilidades Manuais</option>
                  <option value="Artes">Artes</option>
                  <option value="Saúde e Segurança">Saúde e Segurança</option>
                  <option value="Atividades Espirituais">Atividades Espirituais</option>
                  <option value="Atividades Domésticas">Atividades Domésticas</option>
                </select>
              </div>
            )}
          </div>

          {/* Date & Instructor fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Data de Conclusão <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instrutor / Avaliador <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Quem conduziu ou avaliou"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações do Instrutor (opcional)
            </label>
            <textarea
              rows={2}
              placeholder="ex: Demonstrou todos os nós solicitados no acampamento."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center space-x-1.5"
            >
              <Star className="w-4 h-4 fill-purple-950" />
              <span>Conceder Especialidade</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
