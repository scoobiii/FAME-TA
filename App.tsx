import React, { useState, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, List, FileText, Settings, Search, Filter, PlusCircle, Users, Wallet } from 'lucide-react';
import { Project, ProjectStatus, EvaluationCriteria } from './types';
import { initialProjects } from './data';
import ProjectCard from './components/ProjectCard';
import EvaluationModal from './components/EvaluationModal';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const location = useLocation();

  // Dashboard Statistics
  const stats = useMemo(() => {
    const total = projects.length;
    const approved = projects.filter(p => p.status === ProjectStatus.APPROVED).length;
    const totalBudget = projects.reduce((acc, curr) => acc + curr.requestedValue, 0);
    const avgScore = projects.filter(p => p.score).reduce((acc, curr) => acc + (curr.score || 0), 0) / (projects.filter(p => p.score).length || 1);

    const themeData = projects.reduce((acc, curr) => {
      acc[curr.theme] = (acc[curr.theme] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.keys(themeData).map(key => ({ name: key, count: themeData[key] }));
    
    const statusData = [
        { name: 'Classificado', value: approved, color: '#10B981' },
        { name: 'Pendente', value: projects.filter(p => p.status === ProjectStatus.PENDING).length, color: '#9CA3AF' },
        { name: 'Desclassificado', value: projects.filter(p => p.status === ProjectStatus.REJECTED).length, color: '#EF4444' },
    ];

    return { total, approved, totalBudget, avgScore, chartData, statusData };
  }, [projects]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.entityName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleOpenEvaluation = (project: Project) => {
    setSelectedProject(project);
    setIsEvaluationOpen(true);
  };

  const handleSaveEvaluation = (id: string, evaluation: EvaluationCriteria, status: ProjectStatus, score: number, feedback: string) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, evaluation, status, score, feedback } : p
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight">Gestor de<br/><span className="text-blue-400">Emendas 2026</span></h1>
          <p className="text-xs text-slate-400 mt-2">Dep. Tabata Amaral</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/projetos" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === '/projetos' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>
            <List size={20} />
            Lista de Projetos
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-800 text-xs font-semibold text-slate-500 uppercase px-4">Configurações</div>
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 w-full text-left">
            <Settings size={20} />
            Parâmetros do Edital
          </button>
        </nav>
        <div className="p-4 bg-slate-950 text-xs text-slate-500">
          v1.0.0 - Edital 2026
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {location.pathname === '/' ? 'Visão Geral' : 'Gestão de Projetos'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Ciclo 2026 Ativo
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
              TA
            </div>
          </div>
        </header>

        <div className="p-8">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FileText size={24} /></div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Total</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
                    <p className="text-sm text-gray-500 mt-1">Projetos submetidos</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-green-100 rounded-lg text-green-600"><Users size={24} /></div>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Aprovados</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.approved}</h3>
                    <p className="text-sm text-gray-500 mt-1">Classificados p/ voto popular</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Wallet size={24} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats.totalBudget)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Demanda orçamentária</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Filter size={24} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.avgScore.toFixed(1)}</h3>
                    <p className="text-sm text-gray-500 mt-1">Média de pontuação</p>
                  </div>
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Projetos por Área Temática</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.chartData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Status da Análise</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.statusData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {stats.statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            } />

            <Route path="/projetos" element={
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="Buscar por projeto, entidade ou município..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Filter size={18} />
                      Filtrar:
                    </div>
                    <select 
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Todos os Status</option>
                      <option value={ProjectStatus.PENDING}>Pendentes</option>
                      <option value={ProjectStatus.UNDER_REVIEW}>Em Análise</option>
                      <option value={ProjectStatus.APPROVED}>Classificados</option>
                      <option value={ProjectStatus.REJECTED}>Desclassificados</option>
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2">
                      <PlusCircle size={18} /> Novo
                    </button>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map(project => (
                    <ProjectCard 
                      key={project.id} 
                      project={project} 
                      onClick={() => handleOpenEvaluation(project)} 
                    />
                  ))}
                </div>
                
                {filteredProjects.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    Nenhum projeto encontrado com os filtros atuais.
                  </div>
                )}
              </div>
            } />
          </Routes>
        </div>
      </main>

      {/* Evaluation Modal */}
      {isEvaluationOpen && selectedProject && (
        <EvaluationModal 
          project={selectedProject} 
          onClose={() => setIsEvaluationOpen(false)} 
          onSave={handleSaveEvaluation}
        />
      )}
    </div>
  );
};

export default App;