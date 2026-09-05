import { Adventurer, EarnedSpecialty, Unit, TestRecord } from '../types';

export function formatDateBR(dateStr: string): string {
  if (!dateStr) return '';
  // Handles YYYY-MM-DD
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR');
  } catch {
    return dateStr;
  }
}

export function formatDateTimeBR(isoStr: string): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return isoStr;
  }
}

export function formatDayOfWeek(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    return days[d.getDay()];
  } catch {
    return '';
  }
}

export function generateWhatsAppMessage(params: {
  date: string;
  activity: string;
  time: string;
  responsible: string;
  location: string;
  notes?: string;
}): string {
  const dayName = formatDayOfWeek(params.date);
  const formattedDate = formatDateBR(params.date);

  let msg = `📅 ${dayName ? `${dayName}, ` : ''}dia ${formattedDate}\n`;
  msg += `🎯 Especialidade / Atividade: ${params.activity}\n`;
  msg += `🕐 Horário: ${params.time}\n`;
  msg += `👤 Responsável: ${params.responsible}\n`;
  msg += `📍 Local: ${params.location}`;

  if (params.notes && params.notes.trim()) {
    msg += `\n\n📌 Observação: ${params.notes.trim()}`;
  }

  msg += `\n\n✨ Clube de Aventureiros Herança do Céu ✨\n"Por amor a Jesus, farei sempre o meu melhor!"`;

  return msg;
}

export function downloadCSV(filename: string, content: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportAdventurersCSV(
  adventurers: Adventurer[],
  units: Unit[],
  earnedSpecialties: EarnedSpecialty[],
  tests: TestRecord[]
) {
  const headers = [
    'Nome do Aventureiro',
    'Idade',
    'Classe',
    'Unidade',
    'Nome do Responsável',
    'Telefone do Responsável',
    'Total de Especialidades',
    'Especialidades Conquistadas',
    'Provas Aprovadas',
    'Observações'
  ];

  const rows = adventurers.map(adv => {
    const unit = units.find(u => u.id === adv.unitId);
    const advSpecs = earnedSpecialties.filter(e => e.adventurerId === adv.id);
    const advTests = tests.filter(t => t.adventurerId === adv.id && (t.status === 'Aprovado' || (t.numericScore && t.numericScore >= 7)));

    return [
      `"${adv.name.replace(/"/g, '""')}"`,
      adv.age,
      `"${adv.currentClass}"`,
      `"${unit ? unit.name : 'Sem unidade'}"`,
      `"${adv.parentName.replace(/"/g, '""')}"`,
      `"${adv.parentPhone}"`,
      advSpecs.length,
      `"${advSpecs.map(s => s.specialtyName).join('; ')}"`,
      advTests.length,
      `"${(adv.notes || '').replace(/"/g, '""')}"`
    ];
  });

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadCSV(`heranca_do_ceu_aventureiros_${dateStr}.csv`, csvContent);
}
