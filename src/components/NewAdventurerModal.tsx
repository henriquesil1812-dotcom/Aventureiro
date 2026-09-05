import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdventurerClass } from '../types';
import { X, UserPlus, Sparkles, Camera } from 'lucide-react';

interface NewAdventurerModalProps {
  onClose: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
];

export const NewAdventurerModal: React.FC<NewAdventurerModalProps> = ({ onClose }) => {
  const { units, addAdventurer } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(7);
  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const [currentClass, setCurrentClass] = useState<AdventurerClass>('Luminares');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentRelationship, setParentRelationship] = useState('Mãe');
  const [photoUrl, setPhotoUrl] = useState(AVATAR_PRESETS[0]);
  const [customPhoto, setCustomPhoto] = useState(false);
  const [notes, setNotes] = useState('');

  // Auto-suggest class based on age
  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    if (newAge <= 6) setCurrentClass('Abelhinhas Laboriosas');
    else if (newAge === 7) setCurrentClass('Luminares');
    else if (newAge === 8) setCurrentClass('Edificadores');
    else setCurrentClass('Mãos Ajudadoras');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        setCustomPhoto(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentName.trim() || !parentPhone.trim() || !unitId) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    addAdventurer({
      name: name.trim(),
      age,
      unitId,
      currentClass,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentRelationship,
      photoUrl,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 my-auto text-slate-900 relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-[#1F0A38] text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-purple-950">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif">Cadastrar Novo Aventureiro</h3>
              <p className="text-xs text-purple-200">Adicione um novo membro ao Clube Herança do Céu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* Avatar selector / upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>Foto do Aventureiro (opcional)</span>
              <span className="text-[11px] font-normal text-slate-400">Selecione um avatar ou envie foto</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-purple-900 border-2 border-amber-400 flex-shrink-0">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>

              {/* Presets */}
              <div className="flex items-center space-x-2 overflow-x-auto py-1">
                {AVATAR_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setPhotoUrl(p);
                      setCustomPhoto(false);
                    }}
                    className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      photoUrl === p ? 'border-amber-500 scale-105 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}

                {/* Upload custom image */}
                <label className="w-9 h-9 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-500 flex items-center justify-center text-purple-700 bg-purple-50 cursor-pointer flex-shrink-0" title="Carregar do dispositivo">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Dados do Aventureiro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo do Aventureiro <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Daniel Martins dos Santos"
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Idade <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={5}
                max={12}
                value={age}
                onChange={(e) => handleAgeChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unidade / Turma <span className="text-rose-500">*</span>
              </label>
              <select
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                {units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.symbol} {u.name} ({u.ageRange})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Classe Inicial
              </label>
              <select
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value as AdventurerClass)}
                className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="Abelhinhas Laboriosas">Abelhinhas Laboriosas (6 anos)</option>
                <option value="Luminares">Luminares (7 anos)</option>
                <option value="Edificadores">Edificadores (8 anos)</option>
                <option value="Mãos Ajudadoras">Mãos Ajudadoras (9 anos)</option>
              </select>
            </div>
          </div>

          {/* Dados do Responsável */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-purple-950 uppercase tracking-wider block mb-2">
              Contato do Responsável (Pai/Mãe)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Pai/Mãe/Responsável <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="ex: Cristina Martins"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Telefone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="ex: (11) 98765-4321"
                  className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações / Alergias / Cuidados Médicos
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ex: Alergia a picada de inseto, usa óculos, etc."
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-md shadow-purple-900/20 transition-all"
            >
              Concluir Cadastro
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
