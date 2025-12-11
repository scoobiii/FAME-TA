import React, { useState } from 'react';
import { Project, EvaluationCriteria, ProjectStatus } from '../types';
import { X, Save, AlertTriangle } from 'lucide-react';

interface EvaluationModalProps {
  project: Project;
  onClose: () => void;
  onSave: (id: string, evaluation: EvaluationCriteria, status: ProjectStatus, score: number, feedback: string) => void;
}

const EvaluationModal: React.FC<EvaluationModalProps> = ({ project, onClose, onSave }) => {
  const [criteria, setCriteria] = useState<EvaluationCriteria>(project.evaluation || {
    history: 0,
    consistency: 0,
    mandateRelation: 0,
    socialImpact: 0,
    budget: 0
  });
  const [feedback, setFeedback] = useState(project.feedback || '');
  const MAX_FEEDBACK_LENGTH = 1000;

  const totalScore = (Object.values(criteria) as number[]).reduce((a, b) => a + b, 0);
  const isApproved = totalScore >= 70;

  const handleSliderChange = (key: keyof EvaluationCriteria, value: number) => {
    setCriteria(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const newStatus = isApproved ? ProjectStatus.APPROVED : ProjectStatus.REJECTED;
    onSave(project.id, criteria, newStatus, totalScore, feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Análise de Mérito</h2>
            <p className="text-sm text-gray-500">Projeto: {project.projectName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mb-6">
            <h4 className="font-semibold flex items-center gap-2 mb-1">
              <AlertTriangle size={16} /> Critérios do Edital 2026
            </h4>
            <p>
              Projetos com nota inferior a 70 pontos serão desclassificados automaticamente. Analise com base no{' '}
              <a 
                href="https://www.emendastabata.com.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium hover:text-blue-900"
              >
                manual do Edital 2026
              </a>.
            </p>
          </div>

          {/* Criterion 1: History */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">1. Histórico da Instituição</label>
              <span className="font-bold text-slate-700">{criteria.history}/20</span>
            </div>
            <p className="text-xs text-gray-500">Experiência prévia, atuação no estado, parcerias públicas e participação popular.</p>
            <input 
              type="range" min="0" max="20" step="5"
              value={criteria.history}
              onChange={(e) => handleSliderChange('history', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Fraco</span>
              <span>Regular</span>
              <span>Excelente</span>
            </div>
          </div>

          {/* Criterion 2: Consistency */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">2. Consistência do Projeto</label>
              <span className="font-bold text-slate-700">{criteria.consistency}/30</span>
            </div>
            <p className="text-xs text-gray-500">Detalhamento da proposta, viabilidade financeira e clareza nos resultados.</p>
            <input 
              type="range" min="0" max="30" step="5"
              value={criteria.consistency}
              onChange={(e) => handleSliderChange('consistency', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Criterion 3: Mandate Relation */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">3. Relação com o Mandato</label>
              <span className="font-bold text-slate-700">{criteria.mandateRelation}/10</span>
            </div>
            <p className="text-xs text-gray-500">Aderência aos pilares: Educação, Mulheres, Inovação, Meio Ambiente, etc.</p>
            <input 
              type="range" min="0" max="10" step="1"
              value={criteria.mandateRelation}
              onChange={(e) => handleSliderChange('mandateRelation', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Criterion 4: Social Impact */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">4. Impacto Social</label>
              <span className="font-bold text-slate-700">{criteria.socialImpact}/20</span>
            </div>
            <p className="text-xs text-gray-500">Público-alvo (minorias), quantidade de beneficiários e redução de desigualdades.</p>
            <input 
              type="range" min="0" max="20" step="5"
              value={criteria.socialImpact}
              onChange={(e) => handleSliderChange('socialImpact', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Criterion 5: Budget */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium text-gray-700">5. Orçamento</label>
              <span className="font-bold text-slate-700">{criteria.budget}/20</span>
            </div>
            <p className="text-xs text-gray-500">Adequação aos limites (200k-500k) e detalhamento dos gastos.</p>
            <input 
              type="range" min="0" max="20" step="5"
              value={criteria.budget}
              onChange={(e) => handleSliderChange('budget', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Feedback Textarea */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <label className="font-medium text-gray-700">Comentários do Avaliador</label>
              <span className={`text-xs ${feedback.length > MAX_FEEDBACK_LENGTH * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
                {feedback.length}/{MAX_FEEDBACK_LENGTH}
              </span>
            </div>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              rows={4}
              placeholder="Justifique a pontuação ou adicione observações importantes sobre o projeto..."
              value={feedback}
              maxLength={MAX_FEEDBACK_LENGTH}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Pontuação Total</p>
              <p className={`text-3xl font-bold ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
                {totalScore} <span className="text-sm text-gray-400 font-normal">/ 100</span>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 text-right">Resultado Preliminar</p>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {isApproved ? 'Classificado' : 'Desclassificado'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200"
          >
            <Save size={18} />
            Salvar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;