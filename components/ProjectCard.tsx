import React from 'react';
import { Project, ProjectStatus } from '../types';
import { MapPin, Building, CheckCircle, XCircle, AlertCircle, Clock, Edit3, MessageSquare, Bot, UserCheck } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.APPROVED: return 'bg-green-100 text-green-800 border-green-200';
      case ProjectStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      case ProjectStatus.UNDER_REVIEW: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.APPROVED: return <CheckCircle size={16} />;
      case ProjectStatus.REJECTED: return <XCircle size={16} />;
      case ProjectStatus.UNDER_REVIEW: return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const isEvaluated = project.status === ProjectStatus.APPROVED || project.status === ProjectStatus.REJECTED;
  const hasFeedback = project.feedback && project.feedback.trim().length > 0;
  
  // Verifica se foi avaliado pela IA ou por Humano
  const isAiEvaluated = project.evaluator?.includes('IA');
  const isHumanEvaluated = project.evaluator && !isAiEvaluated;

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-all flex flex-col justify-between h-full group relative ${isAiEvaluated ? 'border-purple-200 ring-1 ring-purple-50' : 'border-gray-200'}`}
    >
      <div onClick={onClick} className="cursor-pointer flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            {project.status}
          </span>
          <div className="flex flex-col items-end">
             <span className="text-xs text-gray-500 font-mono">{project.id}</span>
             {isAiEvaluated && (
               <span className="text-[10px] flex items-center gap-1 text-purple-600 bg-purple-50 px-1.5 rounded mt-1 border border-purple-100">
                 <Bot size={10} /> Pré-análise IA
               </span>
             )}
             {isHumanEvaluated && (
               <span className="text-[10px] flex items-center gap-1 text-green-700 bg-green-50 px-1.5 rounded mt-1 border border-green-100">
                 <UserCheck size={10} /> Validado: {project.evaluator?.split(' ')[0]}
               </span>
             )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors" title={project.projectName}>
          {project.projectName}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Building size={14} />
          <span className="truncate max-w-[200px]" title={project.entityName}>{project.entityName}</span>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {project.description}
        </p>
      </div>

      <div className="border-t border-gray-100 pt-3 mt-auto">
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin size={14} />
            {project.municipality}
          </div>
          <div className="font-semibold text-slate-700">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.requestedValue)}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             {project.score !== undefined && (
               <div className={`text-xs font-medium px-2 py-1 rounded border ${project.score >= 70 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                 <span className={project.score >= 70 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{project.score}</span>
                 <span className="text-gray-400">/100</span>
               </div>
             )}
             {hasFeedback && (
                <div className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded border border-blue-100" title="Possui feedback">
                  <MessageSquare size={12} />
                </div>
             )}
           </div>

           <button 
             onClick={(e) => {
               e.stopPropagation();
               onClick();
             }}
             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
               isHumanEvaluated 
                 ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                 : isAiEvaluated
                   ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200'
                   : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200'
             }`}
           >
             <Edit3 size={12} />
             {isHumanEvaluated ? 'Revisar' : isAiEvaluated ? 'Validar IA' : 'Avaliar'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;