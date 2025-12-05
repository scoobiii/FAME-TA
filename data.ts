import { Project, ProjectStatus, ThemeArea } from './types';

// Data extracted and cleaned from the provided PDF OCR
export const initialProjects: Project[] = [
  {
    id: 'Proj-178',
    entityName: 'DEPARTAMENTO DE CULTURA E TURISMO',
    cnpj: '45.159.381/0001-94',
    municipality: 'Urupês',
    projectName: 'Raízes Criativas - Cult',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'Promover o empoderamento através da arte e cultura local. Coordenação e arte no espaço "Raízes Criativas".',
    beneficiaries: 'Jovens e adultos da comunidade local',
    requestedValue: 210000,
    hasParliamentaryAmendment: true,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-181',
    entityName: 'PREFEITURA MUNICIPAL DE JUQUITIBA',
    cnpj: '46.634.440/0001-00', // Mocked based on context, OCR was messy
    municipality: 'Juquitiba',
    projectName: 'Mãe Juquitibense',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'Oferecer consultoria e suporte à gestação. Atendimento físico em uma consultoria especializada.',
    beneficiaries: '330 mães grávidas e 330 bebês',
    requestedValue: 500000,
    hasParliamentaryAmendment: true,
    status: ProjectStatus.UNDER_REVIEW
  },
  {
    id: 'Proj-183',
    entityName: 'PREFEITURA MUNICIPAL DE TAUBATÉ',
    cnpj: '45.176.005/0001-08',
    municipality: 'Taubaté',
    projectName: 'Passarela da Vida',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'Considerando a importância do desenvolvimento urbano, o projeto visa a construção/reforma de passarela.',
    beneficiaries: 'População local que utiliza a travessia',
    requestedValue: 200816,
    hasParliamentaryAmendment: true,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-186',
    entityName: 'PREFEITURA MUNICIPAL DE TAUBATÉ',
    cnpj: '45.176.005/0001-08',
    municipality: 'Taubaté',
    projectName: 'Aquisição de uma Van',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'Aquisição de veículo para transporte de pacientes ou assistência social.',
    beneficiaries: 'Usuários do sistema de saúde/social',
    requestedValue: 484534,
    hasParliamentaryAmendment: true,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-189',
    entityName: 'PREFEITURA MUNICIPAL DE ITU',
    cnpj: '46.634.440/0001-00',
    municipality: 'Itu',
    projectName: 'CONSTRUÇÃO DE CENTRO',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'Construção de prédio CRAS V - Recriança. Objetivo de ampliar o atendimento social.',
    beneficiaries: '5.000 famílias em vulnerabilidade',
    requestedValue: 500000,
    hasParliamentaryAmendment: true,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-191',
    entityName: 'ASSOCIAÇÃO AMANDO O PRÓXIMO',
    cnpj: '15.585.000/0002-59',
    municipality: 'Cruzeiro',
    projectName: 'LAÇOS QUE TRANSFORMAM',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'Projeto de fortalecimento de vínculos no bairro Jardim América. Redução das vulnerabilidades.',
    beneficiaries: '120 crianças e adolescentes',
    requestedValue: 400000,
    hasParliamentaryAmendment: false,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-194',
    entityName: 'ENACTUS BRASIL',
    cnpj: '13.944.860/0001-25',
    municipality: 'São Paulo',
    projectName: 'ENACTUS WORLD CUP',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'O Brasil apresenta déficit no contexto citado. Ampliar a participação na conferência global.',
    beneficiaries: 'Estudantes universitários e comunidades atendidas',
    requestedValue: 500000,
    hasParliamentaryAmendment: false,
    status: ProjectStatus.APPROVED,
    score: 85,
    evaluation: {
        history: 20,
        consistency: 25,
        mandateRelation: 10,
        socialImpact: 20,
        budget: 10
    }
  },
  {
    id: 'Proj-204',
    entityName: 'MUNICÍPIO DE TAUBATÉ',
    cnpj: '45.176.005/0001-08',
    municipality: 'Taubaté',
    projectName: 'Movimenta PSE',
    theme: ThemeArea.SOCIAL_DEV,
    description: 'O projeto prevê a aquisição de veículos para garantir suporte logístico ao Programa Saúde na Escola.',
    beneficiaries: 'Rede pública de ensino',
    requestedValue: 390000,
    hasParliamentaryAmendment: true,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-562',
    entityName: 'Tron Editora Ltda',
    cnpj: '62.338.819/0001-10',
    municipality: 'São Paulo',
    projectName: 'A memória dos Bairros',
    theme: ThemeArea.ENTREPRENEURSHIP,
    description: 'Projeto prevê a produção de material sobre a história local dos bairros.',
    beneficiaries: 'Moradores e estudantes locais',
    requestedValue: 500000,
    hasParliamentaryAmendment: false,
    status: ProjectStatus.REJECTED,
    score: 45,
    evaluation: {
        history: 5,
        consistency: 10,
        mandateRelation: 5,
        socialImpact: 10,
        budget: 15
    }
  },
  {
    id: 'Proj-675',
    entityName: 'Associação Patrulheiros Mirins',
    cnpj: '44.387.959/0001-58',
    municipality: 'São Caetano do Sul',
    projectName: 'Por Dentro do Audiovisual',
    theme: ThemeArea.ENTREPRENEURSHIP,
    description: 'Formar adolescentes na área de audiovisual na região do ABC Paulista.',
    beneficiaries: 'Jovens aprendizes',
    requestedValue: 496196,
    hasParliamentaryAmendment: false,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-733',
    entityName: 'But Futebol Clube',
    cnpj: '04.450.009/0001-55',
    municipality: 'São Paulo',
    projectName: 'Mães do But Futebol',
    theme: ThemeArea.ENTREPRENEURSHIP,
    description: 'As mulheres do Trem. Projeto formará 60 mulheres. Capacitação profissional.',
    beneficiaries: '60 mulheres',
    requestedValue: 500000,
    hasParliamentaryAmendment: true,
    status: ProjectStatus.PENDING
  },
  {
    id: 'Proj-769',
    entityName: 'Artesol - Artesanato Solidário',
    cnpj: '05.354.529/0001-27',
    municipality: 'São Paulo',
    projectName: 'Rede Artesanato de SP',
    theme: ThemeArea.ENTREPRENEURSHIP,
    description: 'O artesanato tradicional como principal objetivo. Rede Artesol espera que o projeto atenda artesãos.',
    beneficiaries: '30 artesãos/grupos',
    requestedValue: 262210,
    hasParliamentaryAmendment: false,
    status: ProjectStatus.PENDING
  }
];