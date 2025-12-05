export enum ProjectStatus {
  PENDING = 'Pendente',
  UNDER_REVIEW = 'Em Análise',
  APPROVED = 'Classificado',
  REJECTED = 'Desclassificado'
}

export enum ThemeArea {
  EDUCATION = 'Educação',
  SOCIAL_DEV = 'Cidadania e Des. Social',
  HEALTH = 'Saúde',
  ENTREPRENEURSHIP = 'Empreendedorismo e Inovação',
  CULTURE_SPORT = 'Cultura e Esporte',
  ENVIRONMENT = 'Meio Ambiente',
  AFFIRMATIVE_ACTION = 'Ações Afirmativas'
}

export interface EvaluationCriteria {
  history: number; // Max 20
  consistency: number; // Max 30
  mandateRelation: number; // Max 10
  socialImpact: number; // Max 20
  budget: number; // Max 20
}

export interface Project {
  id: string;
  entityName: string;
  cnpj: string;
  municipality: string;
  projectName: string;
  theme: ThemeArea;
  description: string;
  beneficiaries: string;
  requestedValue: number;
  hasParliamentaryAmendment: boolean;
  status: ProjectStatus;
  score?: number;
  evaluation?: EvaluationCriteria;
  feedback?: string;
  evaluator?: string;
}

export interface StatMetric {
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}