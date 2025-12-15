import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Project, EvaluationCriteria, ProjectStatus } from '../types';
import { Save, AlertTriangle, Sparkles, Loader2, Bot, ArrowLeft, Building, MapPin, FileText, CheckCircle, XCircle } from 'lucide-react';

interface ProjectDetailsProps {
  projects: Project[];
  onSave: (id: string, evaluation: EvaluationCriteria, status: ProjectStatus, score: number, feedback: string) => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ projects, onSave }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === projectId);

  const [criteria, setCriteria] = useState<EvaluationCriteria>({
    history: 0, consistency: 0, mandateRelation: 0, socialImpact: 0, budget: 0
  });
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const MAX_FEEDBACK_LENGTH = 1000;

  useEffect(() => {
    if (project) {
      setCriteria(project.evaluation || {
        history: 0, consistency: 0, mandateRelation: 0, socialImpact: 0, budget: 0
      });
      setFeedback(project.feedback || '');
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <AlertTriangle size={48} className="mb-4 text-yellow-500" />
        <h2 className="text-xl font-bold">Projeto não encontrado</h2>
        <button onClick={() => navigate('/projetos')} className="mt-4 text-blue-600 hover:underline">
          Voltar para a lista
        </button>
      </div>
    );
  }

  const totalScore = (Object.values(criteria) as number[]).reduce((a, b) => a + b, 0);
  const isApproved = totalScore >= 70;
  const isAiEvaluated = project.evaluator?.includes('IA');

  const handleSliderChange = (key: keyof EvaluationCriteria, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const newStatus = isApproved ? ProjectStatus.APPROVED : ProjectStatus.REJECTED;
    onSave(project.id, criteria, newStatus, totalScore, feedback);
    navigate('/projetos'); // Volta para a lista após salvar
  };

  const generateAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const descLength = project.description.length;
      const budgetOk = project.requestedValue >= 200000 && project.requestedValue <= 500000;
      
      const suggestedCriteria: EvaluationCriteria = {
        history: descLength > 50 ? 15 : 10,
        consistency: descLength > 80 ? 25 : 15,
        mandateRelation: project.theme.includes('Educação') || project.theme.includes('Social') ? 9 : 6,
        socialImpact: 15,
        budget: budgetOk ? 20 : 10
      };

      const justification = `ANÁLISE AUTOMÁTICA (Gemini):\n\n• Histórico (${suggestedCriteria.history}/20): A entidade apresenta tempo de atuação razoável.\n• Consistência (${suggestedCriteria.consistency}/30): Proposta clara com objetivos definidos.\n• Relação com Mandato (${suggestedCriteria.mandateRelation}/10): O tema "${project.theme}" possui aderência.\n• Impacto Social (${suggestedCriteria.socialImpact}/20): Público-alvo definido (${project.beneficiaries}).\n• Orçamento (${suggestedCriteria.budget}/20): Valor R$ ${project.requestedValue.toLocaleString('pt-BR')} ${budgetOk ? 'adequado' : 'inadequado'}.`;

      setCriteria(suggestedCriteria);
      setFeedback(justification);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header com Navegação */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/projetos')}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Projeto</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{project.id}</span>
            <span>•</span>
            <span className={isAiEvaluated ? "text-purple-600 font-medium" : "text-gray-600"}>
              {project.evaluator ? `Avaliado por: ${project.evaluator}` : 'Pendente de Avaliação'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Informações do Projeto */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{project.projectName}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                project.status === ProjectStatus.APPROVED ? 'bg-green-100 text-green-700 border-green-200' :
                project.status === ProjectStatus.REJECTED ? 'bg-red-100 text-red-700 border-red-200' :
                'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {project.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <Building className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Entidade</p>
                  <p className="font-semibold text-gray-900">{project.entityName}</p>
                  <p className="text-xs text-gray-400 font-mono">{project.cnpj}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-500">Município</p>
                  <p className="font-semibold text-gray-900">{project.municipality}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-2">
                  <FileText size={16} /> Descrição
                </h3>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {project.description}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                   <p className="text-xs font-bold text-blue-600 uppercase mb-1">Público Beneficiário</p>
                   <p className="text-blue-900 font-medium">{project.beneficiaries}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                   <p className="text-xs font-bold text-green-600 uppercase mb-1">Valor Solicitado</p>
                   <p className="text-green-900 font-bold text-lg">
                     {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.requestedValue)}
                   </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Documentação Anexada</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer w-full">
                  <div className="bg-red-100 text-red-600 p-2 rounded">PDF</div>
                  <span>Cronograma_Execucao.pdf</span>
               </div>
               <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 cursor-pointer w-full">
                  <div className="bg-green-100 text-green-600 p-2 rounded">XLS</div>
                  <span>Orcamento_Detalhado.xlsx</span>
               </div>
            </div>
          </div>
        </div>

        {/* Coluna da Direita: Painel de Avaliação */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Painel de Avaliação</h3>
              {!isAiEvaluated && (
                <button 
                  onClick={generateAIAnalysis}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-purple-100 transition-colors"
                >
                  {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  IA
                </button>
              )}
            </div>

            <div className="space-y-5">
              {[
                { key: 'history', label: 'Histórico da Instituição', max: 20 },
                { key: 'consistency', label: 'Consistência do Projeto', max: 30 },
                { key: 'mandateRelation', label: 'Relação com Mandato', max: 10 },
                { key: 'socialImpact', label: 'Impacto Social', max: 20 },
                { key: 'budget', label: 'Orçamento', max: 20 }
              ].map((item) => (
                <div key={item.key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <label className="font-medium text-gray-700">{item.label}</label>
                    <span className="font-bold text-blue-600">{criteria[item.key as keyof EvaluationCriteria]}/{item.max}</span>
                  </div>
                  <input 
                    type="range" min="0" max={item.max} step="1"
                    value={criteria[item.key as keyof EvaluationCriteria]}
                    onChange={(e) => handleSliderChange(item.key as keyof EvaluationCriteria, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg flex justify-between items-center border border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Nota Final</p>
                <p className={`text-3xl font-bold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                  {totalScore}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-2 ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {isApproved ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {isApproved ? 'CLASSIFICADO' : 'DESCLASSIFICADO'}
              </div>
            </div>

            {/* Campo de Justificativa Dinâmico */}
            <div className={`mt-6 pt-6 border-t ${isApproved ? 'border-green-100' : 'border-red-100'}`}>
               <label className={`font-bold text-sm mb-2 block flex items-center gap-2 ${isApproved ? 'text-green-800' : 'text-red-800'}`}>
                 <FileText size={16} />
                 {isApproved ? 'Justificativa da Classificação' : 'Justificativa da Desclassificação'}
               </label>
               <p className="text-xs text-gray-500 mb-3">
                 {isApproved 
                   ? 'Descreva os pontos fortes que garantiram a aprovação e a relevância para o mandato.' 
                   : 'Cite os critérios não atendidos ou inconsistências que levaram à desclassificação.'}
               </p>
               <textarea
                className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 min-h-[120px] transition-colors
                  ${isApproved 
                    ? 'border-green-200 focus:ring-green-500 bg-green-50/30 text-green-900 placeholder-green-700/50' 
                    : 'border-red-200 focus:ring-red-500 bg-red-50/30 text-red-900 placeholder-red-700/50'
                  }`}
                placeholder={isApproved 
                  ? "Ex: Projeto consistente, atende aos critérios de impacto social e viabilidade orçamentária. Alinhado com as pautas de educação..." 
                  : "Ex: Orçamento inconsistente com as metas apresentadas. Baixo impacto social ou documentação insuficiente..."}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={MAX_FEEDBACK_LENGTH}
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {feedback.length}/{MAX_FEEDBACK_LENGTH}
              </div>
            </div>

            <button 
              onClick={handleSave}
              className={`w-full mt-6 py-3 font-bold rounded-lg hover:shadow-md transition flex items-center justify-center gap-2 shadow-sm text-white
                ${isApproved 
                  ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-200'
                }`}
            >
              <Save size={20} />
              {isApproved ? 'Confirmar Classificação' : 'Confirmar Desclassificação'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;