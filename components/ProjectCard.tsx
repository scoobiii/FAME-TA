import React from 'react';
import { Project, ProjectStatus } from '../types';
import { MapPin, Building, FileText, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

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

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(project.status)}`}>
            {getStatusIcon(project.status)}
            {project.status}
          </span>
          <span className="text-xs text-gray-500 font-mono">{project.id}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1" title={project.projectName}>
          {project.projectName}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Building size={14} />
          <span className="truncate">{project.entityName}</span>
        </div>

        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {project.description}
        </p>
      </div>

      <div className="border-t border-gray-100 pt-3 mt-auto">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <MapPin size={14} />
            {project.municipality}
          </div>
          <div className="font-semibold text-slate-700">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.requestedValue)}
          </div>
        </div>
        {project.score !== undefined && (
          <div className="mt-2 text-xs font-medium text-right">
            Pontuação: <span className={project.score >= 70 ? 'text-green-600' : 'text-red-600'}>{project.score}/100</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;