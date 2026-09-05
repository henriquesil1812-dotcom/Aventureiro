import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Download, Star, Shield } from 'lucide-react';
import { exportAdventurersCSV } from '../utils/formatters';

interface PrintableReportModalProps {
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({ onClose }) => {
  const { adventurers, units, earnedSpecialties, testRecords, clubSettings } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    exportAdventurersCSV(adventurers, units, earnedSpecialties, testRecords);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl text-slate-900 relative my-auto max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0 print:hidden">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base font-serif">Relatório Geral de Aventureiros</h3>
              <p className="text-[11px] text-slate-400">Pronto para visualização, impressão ou exportação</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExport}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-bold flex items-center space-x-1.5 shadow transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 font-sans print:p-0">
          
          {/* Document Header */}
          <div className="border-b-2 border-purple-900 pb-4 mb-6 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-900 block">
                Igreja Adventista do Sétimo Dia • {clubSettings?.associationDistrict || 'Ministério dos Aventureiros'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-serif tracking-tight uppercase">
                CLUBE DE AVENTUREIROS {clubSettings?.clubName || 'HERANÇA DO CÉU'}
              </h1>
              <p className="text-xs text-slate-600">
                Relatório Geral de Membros, Classes e Especialidades Conquistadas
              </p>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <div>Emissão: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></div>
              <div>Total de Membros: <strong>{adventurers.length}</strong></div>
              <div>Total Especialidades: <strong>{earnedSpecialties.length}</strong></div>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[10px] tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Nome do Aventureiro</th>
                  <th className="py-2.5 px-3">Idade</th>
                  <th className="py-2.5 px-3">Unidade</th>
                  <th className="py-2.5 px-3">Classe Oficial</th>
                  <th className="py-2.5 px-3 text-center">Especialidades</th>
                  <th className="py-2.5 px-3">Responsável (Pai/Mãe)</th>
                  <th className="py-2.5 px-3">Contato / WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {adventurers.map((adv, index) => {
                  const unit = units.find(u => u.id === adv.unitId);
                  const specs = earnedSpecialties.filter(e => e.adventurerId === adv.id);
                  return (
                    <tr key={adv.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{index + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{adv.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{adv.age} anos</td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {unit ? `${unit.symbol} ${unit.name}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-purple-900 font-semibold">{adv.currentClass}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700">
                        <span className="inline-flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{specs.length}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800">{adv.parentName}</td>
                      <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">{adv.parentPhone}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Document Footer Signatures */}
          <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-600">
            <div>
              <div className="w-48 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-bold text-slate-800">Direção do Clube</p>
              <p className="text-[10px] text-slate-400">Herança do Céu</p>
            </div>
            <div>
              <div className="w-48 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-bold text-slate-800">Coordenação de Instrução</p>
              <p className="text-[10px] text-slate-400">Classes e Especialidades</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
