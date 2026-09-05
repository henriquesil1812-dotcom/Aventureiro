import { 
  User, 
  Unit, 
  Adventurer, 
  CatalogSpecialty, 
  EarnedSpecialty, 
  TestRecord, 
  ClassRequirement, 
  ScheduleItem, 
  ReminderNotice, 
  AuditLogEntry,
  ClubSettings
} from '../types';

export const INITIAL_CLUB_SETTINGS: ClubSettings = {
  clubName: 'Herança do Céu',
  clubSubtitle: 'Clube de Aventureiros • Painel Interno',
  clubMotto: 'Por amor a Jesus, farei sempre o meu melhor!',
  districtAssociation: 'Associação / Distrito',
};

export const INITIAL_SPECIALTY_CATEGORIES: string[] = [
  'Natureza',
  'Habilidades Manuais',
  'Artes',
  'Saúde e Segurança',
  'Atividades Espirituais',
  'Atividades Domésticas'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-henrique',
    name: 'Henrique (Instrutor Admin)',
    email: 'henriquesil1812@gmail.com',
    role: 'INSTRUTOR',
    canEdit: true,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-09-04T00:00:00Z',
    password: '', // Sem senha fixa - o usuário define no primeiro acesso ou recuperação
  },
  {
    id: 'user-1',
    name: 'Pr. Carlos Eduardo',
    email: 'instrutor@heranca.com',
    role: 'INSTRUTOR',
    canEdit: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'user-2',
    name: 'Helena Ribeiro (Diretora Geral)',
    email: 'diretoria@heranca.com',
    role: 'DIRETOR',
    canEdit: false, // Default read-only
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-3',
    name: 'Marcos Vinícius (Diretor Associado)',
    email: 'diretor.adjunto@heranca.com',
    role: 'DIRETOR',
    canEdit: true, // Specifically granted edit permission by Instrutor
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-01-20T11:30:00Z',
  }
];

export const INITIAL_UNITS: Unit[] = [
  {
    id: 'unit-1',
    name: 'Estrelinhas do Céu',
    counselorName: 'Tia Fernanda',
    color: '#8B5CF6',
    ageRange: '6 anos',
    symbol: '⭐',
  },
  {
    id: 'unit-2',
    name: 'Luzeiros da Fé',
    counselorName: 'Tio Rodrigo',
    color: '#3B82F6',
    ageRange: '7 anos',
    symbol: '🌟',
  },
  {
    id: 'unit-3',
    name: 'Pequenos Construtores',
    counselorName: 'Tia Daniele',
    color: '#10B981',
    ageRange: '8 anos',
    symbol: '🛡️',
  },
  {
    id: 'unit-4',
    name: 'Mãos Solidárias',
    counselorName: 'Tio Lucas',
    color: '#F59E0B',
    ageRange: '9 anos',
    symbol: '🤝',
  }
];

export const INITIAL_SPECIALTIES_CATALOG: CatalogSpecialty[] = [
  {
    id: 'spec-1',
    name: 'Nós e Amarras',
    category: 'Habilidades Manuais',
    description: 'Aprender e demonstrar os principais nós: direito, cego, laço e pescador.',
    requirementsCount: 6,
  },
  {
    id: 'spec-2',
    name: 'Amigo da Natureza',
    category: 'Natureza',
    description: 'Identificar 5 tipos de árvores e 3 pássaros da região, cuidando do meio ambiente.',
    requirementsCount: 5,
  },
  {
    id: 'spec-3',
    name: 'Primeiros Socorros I',
    category: 'Saúde e Segurança',
    description: 'Saber como agir em pequenos arranhões, queimaduras leves e pedir socorro.',
    requirementsCount: 7,
  },
  {
    id: 'spec-4',
    name: 'Astrônomo Mirim',
    category: 'Natureza',
    description: 'Observar o céu noturno, identificar o Cruzeiro do Sul e entender sobre as estrelas.',
    requirementsCount: 6,
  },
  {
    id: 'spec-5',
    name: 'Artes Plásticas',
    category: 'Artes',
    description: 'Produzir 3 peças artísticas utilizando materiais recicláveis e tintas.',
    requirementsCount: 4,
  },
  {
    id: 'spec-6',
    name: 'Higiene e Saúde',
    category: 'Saúde e Segurança',
    description: 'Manter bons hábitos de higiene diária, escovação dental e lavagem das mãos.',
    requirementsCount: 5,
  },
  {
    id: 'spec-7',
    name: 'Cozinheiro Mirim',
    category: 'Atividades Domésticas',
    description: 'Aprender sobre pirâmide alimentar e preparar um lanche saudável sem fogão.',
    requirementsCount: 6,
  },
  {
    id: 'spec-8',
    name: 'Amigo de Jesus',
    category: 'Atividades Espirituais',
    description: 'Memorizar o voto do Aventureiro, a Lei e orar em família regularmente.',
    requirementsCount: 5,
  },
  {
    id: 'spec-9',
    name: 'Cortesia e Boas Maneiras',
    category: 'Artes',
    description: 'Praticar palavras mágicas (por favor, obrigado) e ajudar colegas na reunião.',
    requirementsCount: 4,
  },
  {
    id: 'spec-10',
    name: 'Guia de Trilhas',
    category: 'Natureza',
    description: 'Caminhada ecológica de 2km seguindo orientações de segurança e sem deixar lixo.',
    requirementsCount: 5,
  }
];

export const INITIAL_CLASS_REQUIREMENTS: ClassRequirement[] = [
  // Abelhinhas Laboriosas (6 anos)
  { id: 'req-ab-1', className: 'Abelhinhas Laboriosas', category: 'Geral', title: 'Idade & Voto', description: 'Ter 6 anos de idade e saber recitar o Voto dos Aventureiros.' },
  { id: 'req-ab-2', className: 'Abelhinhas Laboriosas', category: 'Meu Deus', title: 'Histórias Bíblicas', description: 'Ouvir e recontar 3 histórias bíblicas da Criação.' },
  { id: 'req-ab-3', className: 'Abelhinhas Laboriosas', category: 'Meu Eu', title: 'Especialidade de Higiene', description: 'Completar a especialidade de Higiene e Saúde.' },
  { id: 'req-ab-4', className: 'Abelhinhas Laboriosas', category: 'Minha Família', title: 'Ajudante do Lar', description: 'Auxiliar os pais em tarefas domésticas diárias por 1 semana.' },
  { id: 'req-ab-5', className: 'Abelhinhas Laboriosas', category: 'Meu Mundo', title: 'Amigo da Natureza', description: 'Conquistar a especialidade Amigo da Natureza.' },

  // Luminares (7 anos)
  { id: 'req-lum-1', className: 'Luminares', category: 'Geral', title: 'Voto e Lei', description: 'Ter 7 anos de idade e saber recitar a Lei dos Aventureiros.' },
  { id: 'req-lum-2', className: 'Luminares', category: 'Meu Deus', title: 'Oração Diária', description: 'Aprender o modelo do Pai Nosso e orar diariamente.' },
  { id: 'req-lum-3', className: 'Luminares', category: 'Meu Eu', title: 'Cortesia e Cuidado', description: 'Completar a especialidade de Cortesia e Boas Maneiras.' },
  { id: 'req-lum-4', className: 'Luminares', category: 'Minha Família', title: 'Árvore Genealógica', description: 'Desenhar ou montar a família com fotos de pais e avós.' },
  { id: 'req-lum-5', className: 'Luminares', category: 'Meu Mundo', title: 'Astrônomo Mirim', description: 'Conquistar a especialidade de Astrônomo Mirim ou Artes.' },

  // Edificadores (8 anos)
  { id: 'req-ed-1', className: 'Edificadores', category: 'Geral', title: 'Hino dos Aventureiros', description: 'Cantar e saber a mensagem do Hino oficial dos Aventureiros.' },
  { id: 'req-ed-2', className: 'Edificadores', category: 'Meu Deus', title: 'Livros da Bíblia', description: 'Saber a divisão básica dos livros do Antigo e Novo Testamento.' },
  { id: 'req-ed-3', className: 'Edificadores', category: 'Meu Eu', title: 'Primeiros Socorros', description: 'Completar a especialidade de Primeiros Socorros I.' },
  { id: 'req-ed-4', className: 'Edificadores', category: 'Minha Família', title: 'Noite de Família', description: 'Organizar uma brincadeira bíblica em família.' },
  { id: 'req-ed-5', className: 'Edificadores', category: 'Meu Mundo', title: 'Nós e Amarras', description: 'Conquistar a especialidade de Nós e Amarras.' },

  // Mãos Ajudadoras (9 anos)
  { id: 'req-ma-1', className: 'Mãos Ajudadoras', category: 'Geral', title: 'Maturidade & Liderança', description: 'Ter 9 anos e saber orientar os menores na formação.' },
  { id: 'req-ma-2', className: 'Mãos Ajudadoras', category: 'Meu Deus', title: 'Plano da Salvação', description: 'Explicar de forma simples o amor e a salvação em Jesus.' },
  { id: 'req-ma-3', className: 'Mãos Ajudadoras', category: 'Meu Eu', title: 'Cozinheiro Mirim', description: 'Completar a especialidade de Cozinheiro Mirim.' },
  { id: 'req-ma-4', className: 'Mãos Ajudadoras', category: 'Minha Família', title: 'Gratidão em Família', description: 'Fazer uma carta de gratidão aos responsáveis.' },
  { id: 'req-ma-5', className: 'Mãos Ajudadoras', category: 'Meu Mundo', title: 'Guia de Trilhas', description: 'Conquistar a especialidade de Guia de Trilhas ou Ecologia.' },
];

export const INITIAL_ADVENTURERS: Adventurer[] = [
  {
    id: 'adv-1',
    name: 'Lucas Silva Santos',
    age: 8,
    unitId: 'unit-3', // Pequenos Construtores
    currentClass: 'Edificadores',
    photoUrl: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
    parentName: 'Mariana Silva (Mãe)',
    parentPhone: '(11) 98765-4321',
    parentRelationship: 'Mãe',
    notes: 'Alergia leve a amendoim. Muito dedicado nas tarefas manuais.',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-02-15T14:30:00Z',
  },
  {
    id: 'adv-2',
    name: 'Maria Clara de Souza',
    age: 7,
    unitId: 'unit-2', // Luzeiros da Fé
    currentClass: 'Luminares',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    parentName: 'Roberto de Souza (Pai)',
    parentPhone: '(11) 97654-3210',
    parentRelationship: 'Pai',
    notes: 'Adora as canções e memoriza versículos rapidamente.',
    createdAt: '2026-01-14T09:30:00Z',
    updatedAt: '2026-02-18T11:00:00Z',
  },
  {
    id: 'adv-3',
    name: 'Gabriel Oliveira Costa',
    age: 9,
    unitId: 'unit-4', // Mãos Solidárias
    currentClass: 'Mãos Ajudadoras',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    parentName: 'Juliana Costa (Mãe)',
    parentPhone: '(11) 96543-2109',
    parentRelationship: 'Mãe',
    notes: 'Capitão da unidade. Excelente conduta e liderança.',
    createdAt: '2026-01-10T11:00:00Z',
    updatedAt: '2026-02-20T16:00:00Z',
  },
  {
    id: 'adv-4',
    name: 'Sophia Mendes Rocha',
    age: 6,
    unitId: 'unit-1', // Estrelinhas do Céu
    currentClass: 'Abelhinhas Laboriosas',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    parentName: 'Patrícia Mendes (Mãe)',
    parentPhone: '(11) 95432-1098',
    parentRelationship: 'Mãe',
    notes: 'Primeiro ano no clube. Muito participativa e sorridente.',
    createdAt: '2026-01-22T08:45:00Z',
    updatedAt: '2026-02-10T15:20:00Z',
  },
  {
    id: 'adv-5',
    name: 'Pedro Henrique Lima',
    age: 8,
    unitId: 'unit-3', // Pequenos Construtores
    currentClass: 'Edificadores',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    parentName: 'Carlos Lima (Pai)',
    parentPhone: '(11) 94321-0987',
    parentRelationship: 'Pai',
    notes: 'Gosta de atividades de campo e trilhas na natureza.',
    createdAt: '2026-01-25T14:10:00Z',
    updatedAt: '2026-02-22T10:45:00Z',
  },
  {
    id: 'adv-6',
    name: 'Beatriz Nogueira Alves',
    age: 9,
    unitId: 'unit-4', // Mãos Solidárias
    currentClass: 'Mãos Ajudadoras',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    parentName: 'Renata Nogueira (Mãe)',
    parentPhone: '(11) 93210-9876',
    parentRelationship: 'Mãe',
    notes: 'Concluiu quase todos os requisitos de classe.',
    createdAt: '2026-01-18T10:15:00Z',
    updatedAt: '2026-02-25T17:30:00Z',
  }
];

export const INITIAL_EARNED_SPECIALTIES: EarnedSpecialty[] = [
  {
    id: 'earned-1',
    adventurerId: 'adv-1',
    specialtyName: 'Nós e Amarras',
    category: 'Habilidades Manuais',
    completionDate: '2026-02-15',
    instructorName: 'Instrutor João Paulo',
    notes: 'Demonstrou nó direito e pescador com perfeição.',
  },
  {
    id: 'earned-2',
    adventurerId: 'adv-1',
    specialtyName: 'Amigo da Natureza',
    category: 'Natureza',
    completionDate: '2026-01-28',
    instructorName: 'Instrutora Fernanda',
    notes: 'Identificou 5 espécies de plantas no parque.',
  },
  {
    id: 'earned-3',
    adventurerId: 'adv-2',
    specialtyName: 'Astrônomo Mirim',
    category: 'Natureza',
    completionDate: '2026-02-10',
    instructorName: 'Pr. Carlos Eduardo',
    notes: 'Observação com luneta no pátio da igreja.',
  },
  {
    id: 'earned-4',
    adventurerId: 'adv-2',
    specialtyName: 'Cortesia e Boas Maneiras',
    category: 'Artes',
    completionDate: '2026-01-20',
    instructorName: 'Tia Fernanda',
    notes: 'Muito atenciosa e educada durante a aula.',
  },
  {
    id: 'earned-5',
    adventurerId: 'adv-3',
    specialtyName: 'Primeiros Socorros I',
    category: 'Saúde e Segurança',
    completionDate: '2026-02-05',
    instructorName: 'Instrutor Marcos Vinícius',
    notes: 'Simulação prática de curativo aprovada com louvor.',
  },
  {
    id: 'earned-6',
    adventurerId: 'adv-3',
    specialtyName: 'Guia de Trilhas',
    category: 'Natureza',
    completionDate: '2026-02-18',
    instructorName: 'Instrutor Rodrigo',
    notes: 'Caminhada ecológica no horto florestal.',
  },
  {
    id: 'earned-7',
    adventurerId: 'adv-3',
    specialtyName: 'Cozinheiro Mirim',
    category: 'Atividades Domésticas',
    completionDate: '2026-01-30',
    instructorName: 'Tia Daniele',
    notes: 'Preparou espetinho de frutas nutritivo.',
  },
  {
    id: 'earned-8',
    adventurerId: 'adv-4',
    specialtyName: 'Higiene e Saúde',
    category: 'Saúde e Segurança',
    completionDate: '2026-02-08',
    instructorName: 'Tia Fernanda',
    notes: 'Fez demonstração correta de escovação dentária.',
  },
  {
    id: 'earned-9',
    adventurerId: 'adv-5',
    specialtyName: 'Nós e Amarras',
    category: 'Habilidades Manuais',
    completionDate: '2026-02-15',
    instructorName: 'Instrutor João Paulo',
    notes: 'Aprendeu a fazer amarra quadrada.',
  },
  {
    id: 'earned-10',
    adventurerId: 'adv-6',
    specialtyName: 'Artes Plásticas',
    category: 'Artes',
    completionDate: '2026-02-12',
    instructorName: 'Tia Daniele',
    notes: 'Pintura em tela com tema da Criação.',
  },
  {
    id: 'earned-11',
    adventurerId: 'adv-6',
    specialtyName: 'Amigo de Jesus',
    category: 'Atividades Espirituais',
    completionDate: '2026-01-25',
    instructorName: 'Pr. Carlos Eduardo',
    notes: 'Conhece de cor os versículos da classe.',
  }
];

export const INITIAL_TEST_RECORDS: TestRecord[] = [
  {
    id: 'test-1',
    adventurerId: 'adv-1',
    testName: 'Prova Prática de Nós',
    date: '2026-02-15',
    resultType: 'status',
    status: 'Aprovado',
    examinerName: 'Instrutor João Paulo',
    notes: 'Executou os 4 nós solicitados com rapidez.',
  },
  {
    id: 'test-2',
    adventurerId: 'adv-1',
    testName: 'Teste de Legislação dos Aventureiros',
    date: '2026-01-22',
    resultType: 'numeric',
    numericScore: 9.5,
    maxScore: 10,
    status: 'Aprovado',
    examinerName: 'Helena Ribeiro',
    notes: 'Acertou o voto e a lei na íntegra.',
  },
  {
    id: 'test-3',
    adventurerId: 'adv-2',
    testName: 'Prova de Identificação de Constelações',
    date: '2026-02-10',
    resultType: 'status',
    status: 'Aprovado',
    examinerName: 'Pr. Carlos Eduardo',
    notes: 'Apontou corretamente as 4 estrelas do Cruzeiro do Sul.',
  },
  {
    id: 'test-4',
    adventurerId: 'adv-3',
    testName: 'Avaliação de Primeiros Socorros',
    date: '2026-02-05',
    resultType: 'numeric',
    numericScore: 10.0,
    maxScore: 10,
    status: 'Aprovado',
    examinerName: 'Instrutor Marcos Vinícius',
    notes: 'Desempenho exemplar em atendimento simulado.',
  },
  {
    id: 'test-5',
    adventurerId: 'adv-4',
    testName: 'Teste de Memorização do Voto',
    date: '2026-02-08',
    resultType: 'status',
    status: 'Aprovado',
    examinerName: 'Tia Fernanda',
    notes: 'Recitou o voto com clareza.',
  },
  {
    id: 'test-6',
    adventurerId: 'adv-5',
    testName: 'Prova Teórica de Nós e Cordas',
    date: '2026-02-15',
    resultType: 'numeric',
    numericScore: 8.0,
    maxScore: 10,
    status: 'Aprovado',
    examinerName: 'Instrutor João Paulo',
    notes: 'Precisa praticar mais o nó de cirurgião.',
  }
];

export const INITIAL_CLASS_PROGRESS: Record<string, string[]> = {
  'adv-1': ['req-ed-1', 'req-ed-2', 'req-ed-5'], // 3 of 5 (60%)
  'adv-2': ['req-lum-1', 'req-lum-2', 'req-lum-3', 'req-lum-5'], // 4 of 5 (80%)
  'adv-3': ['req-ma-1', 'req-ma-2', 'req-ma-3', 'req-ma-5'], // 4 of 5 (80%)
  'adv-4': ['req-ab-1', 'req-ab-2', 'req-ab-3'], // 3 of 5 (60%)
  'adv-5': ['req-ed-1', 'req-ed-5'], // 2 of 5 (40%)
  'adv-6': ['req-ma-1', 'req-ma-2', 'req-ma-3', 'req-ma-4', 'req-ma-5'], // 5 of 5 (100%)
};

export const INITIAL_SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    id: 'sched-1',
    specialtyName: 'Astrônomo Mirim (Observação Noturna)',
    plannedDate: '2026-09-13',
    time: '19:00',
    responsible: 'Pr. Carlos Eduardo',
    location: 'Mirante do Parque Ecológico',
    observations: 'Trazer agasalho e lanterna com filtro vermelho.',
    status: 'Planejado',
  },
  {
    id: 'sched-2',
    specialtyName: 'Primeiros Socorros II (Mão na Massa)',
    plannedDate: '2026-09-20',
    time: '14:30',
    responsible: 'Instrutor Marcos Vinícius',
    location: 'Salão Social da Igreja',
    observations: 'Simulação de atendimento com ataduras e curativos.',
    status: 'Planejado',
  },
  {
    id: 'sched-3',
    specialtyName: 'Artes Manuais com Argila',
    plannedDate: '2026-09-27',
    time: '14:30',
    responsible: 'Tia Daniele',
    location: 'Pátio Coberto',
    observations: 'Trazer camiseta velha para não manchar o uniforme.',
    status: 'Planejado',
  },
  {
    id: 'sched-4',
    specialtyName: 'Caminhada Ecológica & Orientação',
    plannedDate: '2026-10-04',
    time: '08:30',
    responsible: 'Instrutor Rodrigo',
    location: 'Trilha da Serra das Estrelas',
    observations: 'Garrafinha de água obrigatória e protetor solar.',
    status: 'Planejado',
  }
];

export const INITIAL_REMINDERS: ReminderNotice[] = [
  {
    id: 'rem-1',
    date: '2026-09-13',
    activity: 'Especialidade de Astrônomo Mirim & Luau das Estrelas',
    time: '19:00',
    responsible: 'Pr. Carlos Eduardo & Diretoria',
    location: 'Pátio da Igreja (área aberta)',
    targetGroup: 'Todos os Pais e Aventureiros',
    formattedText: `📅 Domingo, dia 13/09
🎯 Atividade: Especialidade de Astrônomo Mirim & Luau das Estrelas
🕐 Horário: 19h
👤 Responsável: Pr. Carlos Eduardo & Diretoria
📍 Local: Pátio da Igreja (área aberta)

✨ Por amor a Jesus, farei sempre o meu melhor! Tragam agasalho e lanternas.`,
    createdAt: '2026-09-02T14:20:00Z',
  },
  {
    id: 'rem-2',
    date: '2026-09-20',
    activity: 'Prova Prática de Primeiros Socorros I',
    time: '14:30',
    responsible: 'Instrutor Marcos Vinícius',
    location: 'Salão Social da Igreja',
    targetGroup: 'Unidades Pequenos Construtores e Mãos Solidárias',
    formattedText: `📅 Domingo, dia 20/09
🎯 Especialidade: Prova Prática de Primeiros Socorros I
🕐 Horário: 14:30
👤 Responsável: Instrutor Marcos Vinícius
📍 Local: Salão Social da Igreja

⚠️ Importante: todos com lenço oficial e apostila em mãos!`,
    createdAt: '2026-09-03T18:00:00Z',
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    userId: 'user-1',
    userName: 'Pr. Carlos Eduardo',
    userRole: 'INSTRUTOR',
    action: 'Concedeu Permissão',
    details: 'Concedeu permissão de edição para o Diretor Marcos Vinícius.',
    timestamp: '2026-09-01T14:15:00Z',
  },
  {
    id: 'log-2',
    userId: 'user-3',
    userName: 'Marcos Vinícius',
    userRole: 'DIRETOR',
    action: 'Lançou Especialidade',
    details: 'Registrou especialidade "Guia de Trilhas" para o aventureiro Gabriel Oliveira.',
    timestamp: '2026-09-02T10:30:00Z',
  },
  {
    id: 'log-3',
    userId: 'user-1',
    userName: 'Pr. Carlos Eduardo',
    userRole: 'INSTRUTOR',
    action: 'Criou Lembrete',
    details: 'Criou aviso para WhatsApp da Especialidade de Astrônomo Mirim.',
    timestamp: '2026-09-02T14:20:00Z',
  },
  {
    id: 'log-4',
    userId: 'user-1',
    userName: 'Pr. Carlos Eduardo',
    userRole: 'INSTRUTOR',
    action: 'Registrou Prova',
    details: 'Registrou prova prática de nós com aprovação para Lucas Silva.',
    timestamp: '2026-09-03T16:00:00Z',
  }
];
