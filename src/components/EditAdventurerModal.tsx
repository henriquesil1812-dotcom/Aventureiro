import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Adventurer, AdventurerClass } from '../types';
import { X, Save, Trash2, Camera, User, Check, Sparkles } from 'lucide-react';

interface EditAdventurerModalProps {
  adventurer: Adventurer;
  onClose: () => void;
  onDeleted?: () => void;
}

export const EditAdventurerModal: React.FC<EditAdventurerModalProps> = ({
  adventurer,
  onClose,
  onDeleted,
}) => {
  const { units, updateAdventurer, deleteAdventurer } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(adventurer.name);
  const [age, setAge] = useState<number>(adventurer.age);
  const [unitId, setUnitId] = useState(adventurer.unitId);
  const [currentClass, setCurrentClass] = useState<AdventurerClass>(adventurer.currentClass);
  const [parentName, setParentName] = useState(adventurer.parentName);
  const [parentPhone, setParentPhone] = useState(adventurer.parentPhone);
  const [parentRelationship, setParentRelationship] = useState(adventurer.parentRelationship || 'Mãe');
  const [photoUrl, setPhotoUrl] = useState<string>(adventurer.photoUrl || '');
  const [notes, setNotes] = useState(adventurer.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-adjust class on age change
  const handleAgeChange = (newAge: number) => {
    setAge(newAge);
    if (newAge <= 6) setCurrentClass('Abelhinhas Laboriosas');
    else if (newAge === 7) setCurrentClass('Luminares');
    else if (newAge === 8) setCurrentClass('Edificadores');
    else if (newAge >= 9) setCurrentClass('Mãos Ajudadoras');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A foto selecionada é muito grande. Por favor escolha uma imagem menor que 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentName.trim() || !parentPhone.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Responsável, Telefone).');
      return;
    }

    updateAdventurer(adventurer.id, {
      name: name.trim(),
      age: Number(age),
      unitId,
      currentClass,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentRelationship,
      photoUrl: photoUrl.trim() || undefined,
      notes: notes.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o aventureiro "${adventurer.name}"? Todos os registros de especialidades e provas vinculados serão apagados permanentemente.`)) {
      deleteAdventurer(adventurer.id);
      if (onDeleted) onDeleted();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 my-auto text-slate-900 relative max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-[#1F0A38] text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-purple-950">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg font-serif">Editar Cadastro do Aventureiro</h3>
              <p className="text-xs text-purple-200">Altere dados pessoais, unidade, foto e contatos</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-purple-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* PHOTO MANAGEMENT SECTION (Clear Trocar foto & Remover foto buttons) */}
          <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4">
            <label className="block text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
              Foto do Aventureiro
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Photo Preview */}
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-purple-300 shadow-sm bg-purple-900 flex-shrink-0">
                {photoUrl ? (
                  <img src={photoUrl} alt="Foto do Aventureiro" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-amber-300">
                    <User className="w-8 h-8 opacity-80" />
                    <span className="text-[9px] font-bold mt-0.5">Sem Foto</span>
                  </div>
                )}
              </div>

              {/* Photo Action Buttons */}
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-300" />
                    <span>Alterar Foto</span>
                  </button>

                  {photoUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3.5 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover Foto</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  {photoUrl 
                    ? 'Foto carregada. Clique em "Alterar Foto" para escolher outra imagem ou "Remover" para deixar padrão.' 
                    : 'Nenhuma foto definida. Você pode enviar uma imagem do seu dispositivo (JPEG, PNG).'}
                </p>
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome Completo do Aventureiro <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
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
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
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
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              >
                {units.length === 0 && <option value="">Nenhuma unidade cadastrada</option>}
                {units.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.symbol} {u.name} ({u.ageRange})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Classe Oficial
              </label>
              <select
                value={currentClass}
                onChange={(e) => setCurrentClass(e.target.value as AdventurerClass)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 font-medium"
              >
                <option value="Abelhinhas Laboriosas">Abelhinhas Laboriosas (6 anos)</option>
                <option value="Luminares">Luminares (7 anos)</option>
                <option value="Edificadores">Edificadores (8 anos)</option>
                <option value="Mãos Ajudadoras">Mãos Ajudadoras (9 anos)</option>
              </select>
            </div>
          </div>

          {/* PARENT / CONTACT INFO */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Contato dos Pais ou Responsáveis
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome do Responsável <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grau de Parentesco
                </label>
                <select
                  value={parentRelationship}
                  onChange={(e) => setParentRelationship(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="Mãe">Mãe</option>
                  <option value="Pai">Pai</option>
                  <option value="Avó/Avô">Avó / Avô</option>
                  <option value="Tio/Tia">Tio / Tia</option>
                  <option value="Outro Responsável Legal">Outro Responsável Legal</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  WhatsApp / Telefone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* NOTES & OBSERVATIONS */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações & Saúde (Alergias, Restrições)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Alergia a amendoim, intolerância à lactose, medicação de uso contínuo..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* ACTION BUTTONS (Salvar, Cancelar, Excluir) */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 font-semibold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Aventureiro</span>
            </button>

            <div className="flex items-center space-x-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Alterações Salvas!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-amber-300" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
